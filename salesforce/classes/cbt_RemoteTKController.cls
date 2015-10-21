/*
 * Copyright (c) 2012, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

public with sharing class cbt_RemoteTKController {
    public static String makeError(String message, String errorCode) {
        JSONGenerator gen = JSON.createGenerator(false);
        gen.writeStartArray();
        gen.writeStartObject();
        gen.writeStringField('message', message);
        gen.writeStringField('errorCode', errorCode);
        gen.writeEndObject();
        gen.writeEndArray();
        
        return gen.getAsString();
    }
     
    public static Boolean strictMapping = true;
    public static Boolean applySecurity = true;



    public static String writeFields(String objtype, SObject obj, String fields, String type) {
        Map<String, Object> fieldMap = null;
        try {
            fieldMap = (Map<String, Object>)JSON.deserializeUntyped(fields);
        } catch (JSONException je) {
            return makeError(je.getMessage(), 'JSON_PARSER_ERROR');
        }
        
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        
        Map<String, Schema.sObjectField> targetFields = targetType.getDescribe().fields.getMap();
        
        //if(fieldMap.keySet().size()> 90){
         //   return makeError('Object is to big, limit is 90 fields in object ' + objtype, 'LIMIT_ERROR');
        //}
        
        try {
            for (String key : fieldMap.keySet()) {
                if (targetFields.get(key) == null && strictMapping) {
                    return '[{"message":"Field '+key+' does not exist on object type '+objtype+'","errorCode":"INVALID_FIELD"}]';
                }
                else if (targetFields.get(key) == null) {
                    // Ignore Field, it is new
                }
                else{
                   // Schema.DescribeFieldResult descField = targetFields.get(key).getDescribe();
                    
                   // if (descField.isCreateable() == false && type == 'create' && applySecurity) {
                   //     return makeError('You have no CREATE access for field: ' + key + ' in object ' + objtype, 'NO_ACCESS');
                   // }
                   // if (descField.isUpdateable() == false && type == 'update'  && applySecurity) {
                   //     return makeError('You have no UPDATE access for field: ' + key + ' in object ' + objtype, 'NO_ACCESS');
                   // }
                   // if ( ( descField.isCreateable() == false || targetFields.get(key).getDescribe().isUpdateable() == false ) && type == 'upsert'  && applySecurity) {
                   //     return makeError('You have no UPSERT access for field: ' + key + ' in object ' + objtype, 'NO_ACCESS');
                   // }
                   
                    Object value = fieldMap.get(key);
                    Schema.DisplayType valueType = targetFields.get(key).getDescribe().getType();
                  
                    try{
                        if (value instanceof String && valueType != Schema.DisplayType.String) {
                            // Coerce an incoming String to the correct type
                            String svalue = (String)value;

                            if (valueType == Schema.DisplayType.Date) {
                                obj.put(key, Date.valueOf(svalue));
                            } else if ( valueType == Schema.DisplayType.DateTime) {
                                obj.put(key, DateTime.valueOf(svalue));
                            } else if (valueType == Schema.DisplayType.Percent ||
                                valueType == Schema.DisplayType.Currency) {
                                obj.put(key, svalue == '' ? null : Decimal.valueOf(svalue));
                            } else if (valueType == Schema.DisplayType.Double) {
                                try{
                                    obj.put(key, svalue == '' ? null : Double.valueOf(svalue));
                                }catch( Exception e ){ 
                                    obj.put(key, svalue == '' ? null : Long.valueOf(svalue)); 
                                } 
                            } else if (valueType == Schema.DisplayType.Integer) {
                                obj.put(key, Integer.valueOf(svalue));
                            } else if (valueType == Schema.DisplayType.Base64) {
                                obj.put(key, EncodingUtil.base64Decode(svalue.split(',')[1]));
                            } else {
                                obj.put(key, svalue);
                            }
                        } else {
                            // Just try putting the incoming value on the object
                            obj.put(key, value);
                        }
                    }catch(Exception e){
                        if(cbt_RemoteTKController.strictMapping) throw e;
                    }
                }
            }
        } catch (SObjectException soe) {
            return makeError(soe.getMessage(), 'INVALID_FIELD');
        }
        
        return null;
    }
    
    
    public static String describe(String objtype) {
        // Just enough to make the sample app work!
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
        
        Schema.DescribeSObjectResult sobjResult = targetType.getDescribe();
        
        Map<String, Schema.SObjectField> fieldMap = sobjResult.fields.getMap();
        
        List<Object> fields = new List<Object>();
        for (String key : fieldMap.keySet()) {
            Schema.DescribeFieldResult descField = fieldMap.get(key).getDescribe();
            Map<String, Object> field = new Map<String, Object>();
            
            field.put('type', descField.getType().name().toLowerCase());
            field.put('name', descField.getName());
            field.put('label', descField.getLabel());
            List<String> references = new List<String>();
            for (Schema.sObjectType t: descField.getReferenceTo()) {
                references.add(t.getDescribe().getName());
            }
            if (!references.isEmpty()) {
                field.put('referenceTo', references);
            }
            
            fields.add(field);
        }
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('fields', fields);
        
        return JSON.serialize(result);
    }
    
    
    public static String create(String objtype, String fields) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
        //if(targetType.getDescribe().isCreateable() == false){
         //   return makeError('You have no CREATE access for the '+ objtype +' object', 'NO_ACCESS');
        //}
        
        SObject obj = targetType.newSObject();

        String error = writeFields(objType, obj, fields, 'create');
        if (error != null) {
            return error;
        }

        try {
            insert obj;
        } catch (DMLException dmle) {
            String fieldNames = '';
            for (String field : dmle.getDmlFieldNames(0)) {
                if (fieldNames.length() > 0) {
                    fieldNames += ',';
                }
                fieldNames += '"'+field+'"';
            }
            return makeError(dmle.getDmlMessage(0), dmle.getDmlType(0).name());
            //return '[{"fields":['+fieldNames+'],"message":"'+dmle.getDmlMessage(0)+'","errorCode":"'+dmle.getDmlType(0).name()+'"}]';
        }
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('id', obj.id);
        result.put('errors', new List<String>());
        result.put('success', true);
        
        return JSON.serialize(result);
    }
    
    
    public static String retrieve(String objtype, String id, String fieldlist) {
        // TODO - handle null fieldlist - retrieve all fields
        
        ID MyTestID = null;
        try {
            MyTestID = id; }
        catch(Exception ex) { 
            return makeError('Id provided is not a validad ID: ' + id , 'NO_ACCESS');
        }
        
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
        
        //if(targetType.getDescribe().isAccessible() == false){
         //   return makeError('You have no READ access for the '+ objtype +' object', 'NO_ACCESS');
       // }
        
        Boolean containsId = false;
        for (String field : fieldlist.split(',')) {
            if (field.equalsIgnoreCase('id')){
                containsId = true;
                break;
            }
        }
        
        if (!containsId) {
            fieldlist = 'Id,'+fieldlist;
        }
        
        
        
        String soql = 'SELECT '+fieldlist+' FROM '+objtype;
        soql += ' WHERE Id = \'' + String.escapeSingleQuotes(id) + '\'';
        List<sObject> records;
        try {
            records = Database.query(soql);
        } catch (QueryException qe) {
            return makeError(qe.getMessage(), 'INVALID_QUERY');
        }
        
        if(records.size() == 0 ){
            return makeError('Record with id=' + id + ' was not found', 'RECORD_NOT_FOUND');
        }
        
        return JSON.serialize(records[0]);
    }
    
    
    public static String upser(String objtype, String externalIdField, String externalId, String fields) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
        
       // if(targetType.getDescribe().isUpdateable() == false || targetType.getDescribe().isCreateable() == false){
        //    return makeError('You have no UPSERT access for the '+ objtype +' object', 'NO_ACCESS');
        //}
        
        SObject obj = targetType.newSObject();
        obj.put(externalIdField, externalId);
        
        String error = writeFields(objType, obj, fields, 'upsert');
        if (error != null) {
            return error;
        }
        
        Schema.SObjectField sobjField = targetType.getDescribe().fields.getMap().get(externalIdField);
        
        Database.Upsert(obj, sobjField);
        
        return null;
    }

    
    public static String updat(String objtype, String id, String fields) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
       //  if(targetType.getDescribe().isUpdateable() == false ){
        //    return makeError('You have no UPDATE access for the '+ objtype +' object', 'NO_ACCESS');
        //}
        
        
        SObject obj = targetType.newSObject(id);
        
        String error = writeFields(objType, obj, fields, 'update');
        if (error != null) {
            return error;
        }

        try {
            update obj;
        } catch (DMLException dmle) {
            String fieldNames = '';
            for (String field : dmle.getDmlFieldNames(0)) {
                if (fieldNames.length() > 0) {
                    fieldNames += ',';
                }
                fieldNames += '"'+field+'"';
            }
            return makeError(dmle.getDmlMessage(0), dmle.getDmlType(0).name());
            //return '[{"fields":['+fieldNames+'],"message":"'+dmle.getDmlMessage(0)+'","errorCode":"'+dmle.getDmlType(0).name()+'"}]';
        }
        
        return null;
    }

    
    public static String del(String objtype, String id) {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource does not exist', 'NOT_FOUND');
        }
         //if(targetType.getDescribe().isDeletable() == false){
          //  return makeError('You have no DELETE access for the '+ objtype +' object', 'NO_ACCESS');
        //}
        
        SObject obj = targetType.newSObject(id);
        
        try {
            delete obj;
        } catch (DMLException dmle) {
            String fieldNames = '';
            for (String field : dmle.getDmlFieldNames(0)) {
                if (fieldNames.length() > 0) {
                    fieldNames += ',';
                }
                fieldNames += '"'+field+'"';
            }
            return makeError(dmle.getDmlMessage(0), dmle.getDmlType(0).name());
            //return '[{"fields":['+fieldNames+'],"message":"'+dmle.getDmlMessage(0)+'","errorCode":"'+dmle.getDmlType(0).name()+'"}]';
        }
        
        return null;
    }

    
    public static String query(String soql) {
        //Check for Object Level Access
        Pattern p = Pattern.compile('(from)*(\\w+)');
        Matcher m = p.matcher(soql.toLowercase());
        List<string> soqlParts = new List<String>();
        list<string> soqlFields = new List<String>();
        boolean fromFound =false;
        String objtype = '';
        
        
        while (m.find()) {
            string part = m.group();
            if(part != 'select'){
                if(fromFound==true && objtype == ''){ objtype = part; }
                if(part == 'from'){fromFound=true;}
                if(fromFound==false){
                    soqlFields.add(part);
                }
            }
        }
    
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
        if (targetType == null) {
            return makeError('The requested resource '+ objtype +' does not exist', 'INVALID_QUERY');
        }
        //if(targetType.getDescribe().isAccessible() == false){
         //   return makeError('You have no READ access for the '+ objtype +' object', 'NO_ACCESS');
        //}
        
        Map<String, Schema.sObjectField> targetFields = targetType.getDescribe().fields.getMap();
        
        if(soqlFields.size()> 90){
            return makeError('Query is to big, limit is 90 fields in query ' + objtype, 'LIMIT_ERROR');
        }
        
        for(string field : soqlFields){
             if (targetFields.get(field) != null) {
                Schema.DescribeFieldResult descField = targetFields.get(field).getDescribe();
                //if (descField.isAccessible() == false) {
                 //   return makeError('You have no READ access for this field: ' + field + ' in object: ' + objtype, 'NO_ACCESS');
                //}
             }
        } 
        
        List<sObject> records;
        try {
            records = Database.query(soql);
        } catch (QueryException qe) {
            return makeError(qe.getMessage(), 'INVALID_QUERY');
        }
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('records', records);
        result.put('totalSize', records.size());
        result.put('done', true);
        
        return JSON.serialize(records);
    }


}