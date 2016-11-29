var xml2js =require('xml2js')
var request = require('request')

var math402 = "http://courses.illinois.edu/cisapp/explorer/schedule/2017/Spring/MATH/402.xml?mode=cascade"
var math441 = "http://courses.illinois.edu/cisapp/explorer/schedule/2017/Spring/MATH/441.xml?mode=cascade"

var twilio = require('twilio')
data= require('./info.js');
var accountSid = data.accountSid;
var authToken = data.authToken;
var twilioPhone = data.twilioPhone;
var myPhone = data.myPhone;
client = new twilio.RestClient(accountSid, authToken)
request(math441, function(error, response, body){
	if(!error && response.statusCode == 200){
		xml2js.parseString(body, function(err, result){
			var sections = (result["ns2:course"].detailedSections[0].detailedSection);
			var found = false;
			for(var i = 0; i < sections.length; i++){
				var sect = sections[i]
				var statusSect = sect.enrollmentStatus[0]
				if(statusSect != 'Closed'){
					found = true;
					console.log("Open: " + sect['$'].id);
					client.messages.create({
						body: sect['$'].id,
						to: myPhone,
						from: twilioPhone
					}, function(err, message){
						console.log(message.sid);
					});
				}
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
