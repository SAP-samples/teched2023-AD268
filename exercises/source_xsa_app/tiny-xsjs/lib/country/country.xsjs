async function saveCountry(country) {
   var conn = await $.hdb.getConnection();
   var output = JSON.stringify(country);
   var fnCreateCountry = await conn.loadProcedure("tinyworld.tinydb::createCountry");
   var result = await fnCreateCountry({IM_COUNTRY: country.name, IM_CONTINENT: country.partof});
   
   await conn.commit();
   conn.close();
   if (result && result.EX_ERROR !== null) { 
      return {body : result, status: $.net.http.BAD_REQUEST};
   } 
   else { 
      return {body : output, status: $.net.http.CREATED};
   }
}
var body = $.request.body.asString();

var country = JSON.parse(body);

var output = await saveCountry(country);

$.response.contentType = "application/json";
await $.response.setBody(output);
$.response.status = output.status;

export default {saveCountry,body,country,output};
