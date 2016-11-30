var xml2js =require('xml2js')
var request = require('request')

var prefix = "http://courses.illinois.edu/cisapp/explorer/schedule/2017/Spring/";

var twilio = require('twilio')
data= require('./info.js');
var accountSid = data.accountSid;
var authToken = data.authToken;
var twilioPhone = data.twilioPhone;
var myPhone = data.myPhone;
client = new twilio.RestClient(accountSid, authToken)
function checkAvailability(dept, num){
	var url = prefix + dept + "/" + num + ".xml?mode=cascade";
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			xml2js.parseString(body, function(err, result){
				var sections = (result["ns2:course"].detailedSections[0].detailedSection);
				var found = false;
				for(var i = 0; i < sections.length; i++){
					var sect = sections[i]
						var statusSect = sect.enrollmentStatus[0]
						if(statusSect != 'Closed'){
							found = true;
							var message = dept + num + " - " +  sect['$'].id;
							console.log(message)
							client.messages.create({
								body: message,
								to: myPhone,
								from: twilioPhone
							}, function(err, message){
								console.log(message.sid);
							});
						}
				}
				if(!found){
					var message = dept + num + " - still no classes found";
					console.log(message);
				}
			});
		}
		else{
			client.messages.create({
				body: "Something went wrong with ClassNotifier",
				to: myPhone,
				from: twilioPhone
			}, function(err, message){
				console.log(message.sid);
			});
		}
	});
}

checkAvailability("MATH", "441")
checkAvailability("MATH", "403")

