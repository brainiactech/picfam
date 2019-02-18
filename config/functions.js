//FUNCTIONS

export function UppperCaseFirst(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function FormatDate(datetime) {
    var theEvent = new Date(datetime);
    now = new Date();
    var timeElapsed = (now - theEvent) / 1000;

    var seconds    = timeElapsed ;
    var minutes    = Math.floor(timeElapsed / 60 );
    var hours      = Math.floor(timeElapsed / 3600);
    var days       = Math.floor(timeElapsed / 86400 );
    var weeks      = Math.floor(timeElapsed / 604800);
    var months     = Math.floor(timeElapsed / 2600640 );
    var years      = Math.floor(timeElapsed / 31207680 );
    
    if (seconds <= 60) {return "MOMENTS AGO";}
    if (minutes <= 60) {if(minutes ==1){return "A MIN AGO"}else{return minutes+" MINS AGO";}}
    if (hours <= 24) {if(hours == 1){return "AN HOUR AGO"}else{return hours+ " HOURS AGO";}}
    if (days <= 7) {if(days == 1){return "A DAY AGO"}else{return days+ " DAYS AGO";}}
    if (weeks <= 4.3) {if(weeks == 1){return "A WEEK AGO"}else{return weeks+ " WEEKS AGO";}}
    if (months <= 12) {if(months == 1){return "A MONTH AGo"}else{return months+ " MONTHS AGO";}}
    else {if(years == 1){return "A YEAR AGO"}else{return years+ " YEARS AGO";}}
}


export function sendPushNotification (data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic MDY2YjBlZWEtNWJlZS00NTc0LWI0YWUtMjNiYmU2MzI5MGM1"
    };
    
    fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    }).then(res =>{
        //console.log("on success", JSON.stringify(res,  null, 4));
    }).catch(error => {
       // console.log("on failure ",JSON.stringify(error, null, 4));
    });
}
