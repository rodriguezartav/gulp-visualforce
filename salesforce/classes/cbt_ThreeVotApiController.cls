/*
 * Copyright (c) 2014, 3VOT Corporation.
 * All rights reserved.
*/
 
/*
	ThreeVotApiController acts like a Interface to the Salesforce API and operates inside Visualforce, 
	this way Javascript applications can use traditional open source components to send/receive SF Data 
	
	This simple class uses the Force.com Open Source cbt_RemoteTKController to encode and decode JSON 
	
*/
public with sharing class cbt_ThreeVotApiController {

    //handleRest receives an REST Operation['get,post,put,del'] a url and a JSON
	/*
		Class Entry Point for Visualforce Remoting
		It requires: 
			An HTTP VERB that defines what operation to perform ['get,post,put,del']
			An Url that defines the targeted object or custom operation to be performaned
			An optional Fields argument for upsert and query operations
	*/

    @RemoteAction
    public static String handleRest(string verb, String url, string fields) {
        //Get any query string parameters
        Map<String,String> queryReference  = new PageReference(url).getParameters();
        Map<String, String> urlReference = getUrlParts(url);
            if( isApiOperation(urlReference.get('operation') ) ){ 
                return cbt_ThreeVotApiController.doApiOperation(verb, urlReference.get('operation'), fields, queryReference); 
            }
            else if( isRest( urlReference.get('type') ) ){
                return cbt_ThreeVotApiController.doRest(verb, urlReference.get('type'), urlReference.get('id'), fields);
            }
           
            return cbt_RemoteTKController.makeError('Operation not found, request url and/or options are not valid', 'INVALID_OPERATION');
    }
    
   @RemoteAction
   public static string getPicklistValues(string obj, String fld)
   {

   	  Schema.SObjectType objType = Schema.getGlobalDescribe().get(obj);

      list<SelectOption> options = new list<SelectOption>();

      // Describe the SObject using its object type.
      Schema.DescribeSObjectResult objDescribe = objType.getDescribe();       
      // Get a map of fields for the SObject
      map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap(); 
      // Get the list of picklist values for this field.
      
      
      list<Schema.PicklistEntry> values =
         fieldMap.get(fld).getDescribe().getPickListValues();
      // Add these values to the selectoption list.
              
              
	  List<String> optionsList = new List<String>();       
      for (Schema.PicklistEntry a : values)
      { 
      	optionsList.add(a.getValue());
      }

      Map<String, List<string>> result = new Map<String, List<string>>();
      result.put(fld,optionsList);

      return JSON.serialize(result);
   }
    
    /*
		This function get's called when we determined it's a REST Operation
	*/
    public static string doRest(string verb, string objtype, string id, string fields){
        string result = cbt_RemoteTKController.makeError('Operation Not Found', 'ERR-3VOT-1');
        if(verb == 'post'){ result = cbt_RemoteTKController.create(objtype, fields); }
        else if(verb == 'get'){ result = cbt_RemoteTKController.retrieve(objtype, id, fields ); }
        else if(verb == 'del'){ result = cbt_RemoteTKController.del(objtype, id); }
        else if(verb == 'put'){ result = cbt_RemoteTKController.updat(objtype, id, fields); }
        return result;
    }
    
    /*
		This function get's called when we determined it's a Custom Operation
	*/
    public static string doApiOperation(string verb, string type, string fields, map<string,string> queryReference){
        string result = '';
        //if(verb == 'post'){
        	//queryReference = (Map<String,String>)JSON.deserializeUntyped(fields);
        //}
        
        if( type == 'query'&& queryReference.get('query') != null ){ 
        	result = cbt_RemoteTKController.query( queryReference.get('query') ); 
        }

        else{
        	result = cbt_RemoteTKController.makeError('Query or Body Arguments do not match API Operations','MALFORMED_QUERY');
        }

        return result;
    }
    
 	/*
		Helper function to split URL in Object, Id and Custom Parts
	*/
 	public static Map<String,String> getUrlParts(string url){
	    Map<string,string> result = new Map<String,String>();
	    List<string> queryParts = url.split('\\?');
	    List<string> urlParts = queryParts[0].split('/');
	    
	    if( cbt_ThreeVotApiController.isApiOperation(urlParts.get(1)) ){
	    	result.put('operation', urlParts.get(1));                       
	    }
	    else{ 
	    	result.put('type', urlParts.get(1));                       
	        if( urlparts.size() > 2  && cbt_ThreeVotApiController.isIdValid(urlParts.get(2)) ){
	           result.put('id', urlParts.get(2) );
	        }
	    }
	
	    return result;
	}
    
    /*
		Helper function to figure if URL Part is an ID or another element
	*/
    public static boolean isIdValid(string MyTestString){
        ID MyTestID = null;
        try {
            MyTestID = MyTestString; 
            return true;
        }
        catch(Exception ex) { return false; }
    }

	/*
		Helper function to figure if URL Part is a Salesforce Object
	*/
    public static boolean isRest(string type){
        boolean result = false;
        if (Schema.getGlobalDescribe().get(type) != null) { result = true; }
        return result;
    }

	/*
		Helper function to figure if URL Part is a Custom Operation
	*/
    public static boolean isApiOperation(string type){
        boolean result = false;
        if (type == 'query') { result = true; }
        return result;
    }
 
}