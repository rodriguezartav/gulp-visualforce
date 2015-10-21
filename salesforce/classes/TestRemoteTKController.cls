@isTest
public class TestRemoteTKController{
    
    private static String tooLongAccName = 'LOTS OF '+
        'CHARACTERS XXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'+
        'XXXXXXXXXXXXXXXX';
    
    static private void assertError(String jsonResult, String expectedError, String method) {
        List<Object> errorArray = (List<Object>)JSON.deserializeUntyped(jsonResult);
        
        System.assertNotEquals(null, errorArray, 
                               'error array missing from '+method+' result');
        System.assertNotEquals(0, errorArray.size(), 
                               'error array is empty in '+method+' result');
        
        Map<String, Object> error = (Map<String, Object>)errorArray[0];
        String errorCode = (String)error.get('errorCode');
        System.assertNotEquals(null, errorCode, 
                               'errorCode property missing from '+method+' result');
        System.assertEquals(expectedError, errorCode, 
                               'errorCode should be '+expectedError+' in '+method+' result');
    }
    
    static testMethod void testDescribe() {
        // Assume we have accounts
        String jsonResult = cbt_RemoteTKController.describe('Account');
        
        System.assertNotEquals(null, jsonResult, 
                               'cbt_RemoteTKController.describe returned null');
                      
        Map<String, Object> result = (Map<String, Object>)JSON.deserializeUntyped(jsonResult);
        
        System.assertNotEquals(null, result.get('fields'), 
                               'fields property missing from cbt_RemoteTKController.describe result');

        // TODO - more assertions on describe results
        
         Schema.SObjectType targetType = Schema.getGlobalDescribe().get('Account');
        
        Map<String, Schema.sObjectField> targetFields = targetType.getDescribe().fields.getMap();
        
        Schema.DescribeFieldResult descField = targetFields.get('AccountNumber').getDescribe();
        
       	if (descField.isCreateable() == false || descField.isUpdateable() == false || descField.isAccessible() ==false) {
       		System.assertEquals(false, true, 'System Administrator requires access to Account Account Number');  
       	}
       	
        // Invalid object type
        // Hope there isn't a QXZXQZXZQXZQ object type!
        jsonResult = cbt_RemoteTKController.describe('QXZXQZXZQXZQ');
        assertError(jsonResult, 'NOT_FOUND', 'cbt_RemoteTKController.describe');        
    }
    
    static private void assertRecord(Map<String, Object> record, String accName, String accNumber, String method) {
        Map<String, Object> attributes = (Map<String, Object>)record.get('attributes');
        System.assertNotEquals(null, attributes, 
                               'attributes property missing from '+method+' result');
        System.assertNotEquals(0, attributes.keySet().size(), 
                               'empty attributes object in '+method+' result');
        
        String type = (String)attributes.get('type');
        System.assertNotEquals(null, type, 
                               'type property missing from '+method+' result');
        System.assertEquals('Account', type, 
                               'Wrong type in '+method+' result');
        
        String url = (String)attributes.get('url');
        System.assertNotEquals(null, url, 
                               'url property missing from '+method+' result');
       
        Id id = (Id)record.get('Id');
        System.assertNotEquals(null, id, 
                               'Id property missing from '+method+' result');
        Account account = [SELECT Id, Name FROM Account WHERE Id = :id LIMIT 1];
        System.assertNotEquals(null, account, 
                               'Couldn\'t find account record identified by '+method+' result');
        System.assertEquals(accName, account.Name, 
                               'Account name doesn\'t match in '+method+' result');
        
        String name = (String)record.get('Name');
        System.assertNotEquals(null, name, 
                               'Name property missing from '+method+' result');
        System.assertEquals(accName, name, 
                               'Wrong account name in '+method+' result');
   
        String accountNumber = (String)record.get('AccountNumber');
        System.assertNotEquals(null, name, 
                               'AccountNumber property missing from '+method+' result');
        System.assertEquals(accNumber, accountNumber, 
                               'Wrong account number in '+method+' result');
    }
    
    static private Id testCreate(String accName, String accNumber, String fields) {
        // Assume we can create an account
        
        // Try with data in correct types
        String jsonResult = cbt_RemoteTKController.create('Account', 
            '{"Name": "'+accName+'", '+
             '"AccountNumber" : "'+accNumber+'",'+
             fields+'}');
        
        System.assertNotEquals(null, jsonResult, 
                               'cbt_RemoteTKController.create returned null');
        
        Map<String, Object> result = (Map<String, Object>)JSON.deserializeUntyped(jsonResult);
        
        Boolean success = (Boolean)result.get('success');
        System.assertNotEquals(null, success, 
                               'success property missing from cbt_RemoteTKController.create result');
        System.assertNotEquals(false, success, 
                               'success is false in cbt_RemoteTKController.create result');
        
        List<Object> errors = (List<Object>)result.get('errors');
        System.assertNotEquals(null, errors, 
                               'errors property missing from cbt_RemoteTKController.create result');
        System.assertEquals(0, errors.size(), 
                               'errors array is not empty in cbt_RemoteTKController.create result');
        
        Id id = (Id)result.get('id');
        System.assertNotEquals(null, id, 
                               'id property missing from cbt_RemoteTKController.create result');
        Account account = [SELECT Id, Name, AccountNumber FROM Account LIMIT 1];
        System.assertNotEquals(null, account, 
                               'Couldn\'t find account record created by cbt_RemoteTKController.create result');
        System.assertEquals(accName, account.Name, 
                               'Account name doesn\'t match in cbt_RemoteTKController.create result');
        System.assertEquals(accNumber, account.AccountNumber, 
                               'Account number doesn\'t match in cbt_RemoteTKController.create result');
        
        jsonResult = cbt_RemoteTKController.create('QXZXQZXZQXZQ', '{"Name": "'+accName+'"}');
        assertError(jsonResult, 'NOT_FOUND', 'cbt_RemoteTKController.create');
                
        jsonResult = cbt_RemoteTKController.create('Account', '{"Name" "'+accName+'"}');
        assertError(jsonResult, 'JSON_PARSER_ERROR', 'cbt_RemoteTKController.create');
                
        jsonResult = cbt_RemoteTKController.create('Account', '{"XQZXQZXQZXQZ" : "'+accName+'"}');
        assertError(jsonResult, 'INVALID_FIELD', 'cbt_RemoteTKController.create');

        jsonResult = cbt_RemoteTKController.create('Account', '{"Name" : "'+tooLongAccName+'"}');
        assertError(jsonResult, 'STRING_TOO_LONG', 'cbt_RemoteTKController.create');

        return id;
    }
    
    static private void testRetrieve(String accName, String accNumber, Id id) {
        String jsonResult = cbt_RemoteTKController.retrieve('Account', id, 'Name, AccountNumber');
        
        System.assertNotEquals(null, jsonResult, 
                               'cbt_RemoteTKController.retrieve returned null');
        
        Map<String, Object> result = (Map<String, Object>)JSON.deserializeUntyped(jsonResult);
        
        assertRecord(result, accName, accNumber, 'cbt_RemoteTKController.retrieve');        

	    jsonResult = cbt_RemoteTKController.retrieve('Account', 'anyid', 'Name, AccountNumber');
	
	    assertError(jsonResult, 'NO_ACCESS', 'cbt_RemoteTKController.retrieve');
	
        
    }

    static private void testQuery(String accName, String accNumber) {
        String jsonResult = cbt_RemoteTKController.query('SELECT Id, Name, AccountNumber FROM Account WHERE Name = \''+String.escapeSingleQuotes(accName)+'\'');
        
        System.assertNotEquals(null, jsonResult, 
                               'cbt_RemoteTKController.query returned null');
                
        List<Object> records = (List<Object>)JSON.deserializeUntyped(jsonResult);
        
        System.assertNotEquals(null, records, 
                               'records property missing from cbt_RemoteTKController.query result');
        System.assertEquals(1, records.size(), 
                               'records array should have single record in cbt_RemoteTKController.query result');
        
        Map<String, Object> record = (Map<String, Object>)records[0];
        
        assertRecord(record, accName, accNumber, 'cbt_RemoteTKController.query');        
        
        jsonResult = cbt_RemoteTKController.query('SSSSSS Id, Name FROM Account WHERE Name = \''+accName+'\'');
        assertError(jsonResult, 'INVALID_QUERY', 'cbt_RemoteTKController.query');
        
    }



    static private void testUpdate(String accName, String accNumber, Id id, String fields) {
        String jsonResult = cbt_RemoteTKController.updat('Account', id, '{"Name":"'+accName+'", "AccountNumber":"'+accNumber+'"}'); 
        System.assertEquals(null, jsonResult, 
                               'Non-null result from cbt_RemoteTKController.updat');
        Account account = [SELECT Id, Name, AccountNumber FROM Account WHERE Id = :id LIMIT 1];
        System.assertNotEquals(null, account, 
                               'Couldn\'t find account record after cbt_RemoteTKController.updat');
        System.assertEquals(accName, account.Name, 
                               'Account name doesn\'t match after cbt_RemoteTKController.updat');
        System.assertEquals(accNumber, account.AccountNumber, 
                               'Account number doesn\'t match after cbt_RemoteTKController.updat');
        
        jsonResult = cbt_RemoteTKController.updat('QXZXQZXZQXZQ', id, '{"Name":"'+accName+'"}');
        assertError(jsonResult, 'NOT_FOUND', 'cbt_RemoteTKController.updat');
        
        jsonResult = cbt_RemoteTKController.updat('Account', id, '{"XQZXQZXQZXQZ" : "'+accName+'"}');
        assertError(jsonResult, 'INVALID_FIELD', 'cbt_RemoteTKController.updat');

        jsonResult = cbt_RemoteTKController.updat('Account', id, '{"Name" "'+accName+'"}');
        assertError(jsonResult, 'JSON_PARSER_ERROR', 'cbt_RemoteTKController.updat');
                
        jsonResult = cbt_RemoteTKController.updat('Account', id, '{"Name" : "'+tooLongAccName+'"}');
        assertError(jsonResult, 'STRING_TOO_LONG', 'cbt_RemoteTKController.updat');
    }

    static private void testUpsert(String accName, String accNumber, Id id, String fields) {
        String jsonResult = cbt_RemoteTKController.upser('Account', 
                                                     'Id', 
                                                     (String)id, 
                                                     '{"Name":"'+accName+'", '+
                                                     '"AccountNumber":"'+accNumber+'",'+
                                                     fields+'}');
        System.assertEquals(null, jsonResult, 
                               'Non-null result from cbt_RemoteTKController.upser');
        Account account = [SELECT Id, Name, AccountNumber FROM Account WHERE Id = :id LIMIT 1];
        System.assertNotEquals(null, account, 
                               'Couldn\'t find account record after cbt_RemoteTKController.upser');
        System.assertEquals(accName, account.Name, 
                               'Account name doesn\'t match after cbt_RemoteTKController.upser');
        System.assertEquals(accNumber, account.AccountNumber, 
                               'Account number doesn\'t match after cbt_RemoteTKController.upser');
        
        jsonResult = cbt_RemoteTKController.upser('QXZXQZXZQXZQ', 'Id', (String)id, '{"Name":"'+accName+'"}');
        assertError(jsonResult, 'NOT_FOUND', 'cbt_RemoteTKController.upser');
        
        jsonResult = cbt_RemoteTKController.upser('Account', 'Id', (String)id, '{"XQZXQZXQZXQZ" : "'+accName+'"}');
        assertError(jsonResult, 'INVALID_FIELD', 'cbt_RemoteTKController.upser');
    }

    static private void testDelete(Id id) {
        String jsonResult = cbt_RemoteTKController.del('QXZXQZXZQXZQ', id);
        assertError(jsonResult, 'NOT_FOUND', 'cbt_RemoteTKController.del');

        jsonResult = cbt_RemoteTKController.del('Account', id); 
        System.assertEquals(null, jsonResult, 
                               'Non-null result from cbt_RemoteTKController.del');
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE Id = :id];
        System.assertEquals(0, accounts.size(), 
                               'Account record was not deleted by cbt_RemoteTKController.del');

        jsonResult = cbt_RemoteTKController.del('Account', id); 
        assertError(jsonResult, 'ENTITY_IS_DELETED', 'cbt_RemoteTKController.del');
    }
    
    static testMethod void testCRUD() {
    	
      Profile p = [select id from profile where name like '%Administrator%']; 
      User u = new User(Alias = 'standt', Email='standarduser'+Math.random() * 100000+'@abcgggtestorg.com', 
      EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
      LocaleSidKey='en_US', ProfileId = p.Id, 
      TimeZoneSidKey='America/Los_Angeles', UserName='standarduser'+Math.random()*10000+'@testorg.com');
    	
    	System.runAs(u){
    	
        String accName = 'Test1';
        String accNumber = '1234';
        
        // String field values
        Id id = testCreate(accName, accNumber, '"AnnualRevenue" : "1000000",'+
             '"NumberOfEmployees" : "1000",'+
             '"Phone" : "(111) 222-3333"');
        testDelete(id);
        
        // Integer field values
        id = testCreate(accName, accNumber, '"AnnualRevenue" : 1000000,'+
             '"NumberOfEmployees" : 1000,'+
             '"Phone" : "(111) 222-3333"');
        testRetrieve(accName, accNumber, id);
        testQuery(accName, accNumber);
        testUpdate(accName+'1', accNumber+'1', id, '"AnnualRevenue" : "1100000",'+
             '"NumberOfEmployees" : "1100",'+
             '"Phone" : "(112) 222-3333"');
        testUpdate(accName+'2', accNumber+'2', id, '"AnnualRevenue" : "2000000",'+
             '"NumberOfEmployees" : "2000",'+
             '"Phone" : "(222) 222-3333"');
        testUpsert(accName+'3', accNumber+'3', id, '"AnnualRevenue" : 3000000,'+
             '"NumberOfEmployees" : 3000,'+
             '"Phone" : "(333) 222-3333"');
        testUpsert(accName+'4', accNumber+'4', id, '"AnnualRevenue" : 4000000,'+
             '"NumberOfEmployees" : 4000,'+
             '"Phone" : "(444) 222-3333"');
        testDelete(id);
    	}
    }
}