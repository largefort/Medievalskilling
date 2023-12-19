onload=LaggedAPI.init('lagdev_4255', 'ca-pub-4695170235902689');
  //
//pause game / music before calling:
//
LaggedAPI.APIAds.show(function() {

  //
  // ad is finished, unpause game/music
  //

console.log("ad completed");

});
var boardinfo={};
boardinfo.score=SCORE_VAR;
boardinfo.board=medievalclicker_hsbdltp;

LaggedAPI.Scores.save(boardinfo, function(response) {
if(response.success) {
console.log('high score saved')
}else {
console.log(response.errormsg);
}
});
  var api_awards=[];
api_awards.push(medievalclicker_rrgau001 - bought one knight in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
  var api_awards=[];
api_awards.push(medievalclicker_rrgau002 - bought one archer in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
var api_awards=[];
api_awards.push(medievalclicker_rrgau003 - bought one wizard in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
  var api_awards=[];
api_awards.push(medievalclicker_rrgau004 - bought one paladin in MedievalClicker);

//can push more than one award at a time
LaggedAPI.Achievements.save(api_awards, function(response) {
if(response.success) {
console.log('achievement saved')
}else {
console.log(response.errormsg);
}
});
