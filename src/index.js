function getDurationInTimeFormat(seconds)
{
    let formated_time = '';
    let time_ratios = [86400, 3600, 60, 1];
    time_ratios.forEach(function(element){
        formated_time += parseInt(seconds / element) + ":";
        seconds = seconds % element;
    });
    formated_time = formated_time.slice(0,-1);
    return formated_time;
}


function getDurationInSeconds(duration = "")
{
    let time_ratios =  [1, 60, 3600, 86400];
    let seconds = duration.split(":").reverse().map(function(element, index){
        return parseInt(element) * time_ratios[index];
    }).reduce(function(e,d){
        return e+d;
    });
    return seconds;
}

window.ytstats_highlightChannel = function(channelName)
{
    let playlist_elements = document.querySelectorAll('ytd-playlist-video-renderer');
    playlist_elements.forEach(function(element, index){

        let name = element.getAttribute('ytplstatslibrary-name');
        element.style.display = "none";
        if(name == channelName)
        {
            element.style.display = "flex";
        }
    });

};

function init()
{
    buildTimeDashboard();
}

window.ytstats_filter = function(event)
{
    let filter = event.target.value;
    let playlist_elements = document.querySelectorAll('ytd-playlist-video-renderer');
    playlist_elements.forEach(function(element, index){

        let name = element.getAttribute('ytplstatslibrary-name');
        let title = element.querySelector('h3').innerHTML;
        element.style.display = "none";
        if(name.toLowerCase().includes(filter) || title.toLowerCase().includes(filter))
        {
            element.style.display = "flex";
        }
    });
};



function buildTimeDashboard()
{
    let playlist_elements = document.querySelectorAll('ytd-playlist-video-renderer');

    let v2 = Array();
    let total_time = 0;

    playlist_elements.forEach(function(element, index){
        const block = element.querySelector('ytd-channel-name a');
        let link = block.href;
        let name = block.innerHTML;
        let duration = element.querySelector('ytd-thumbnail-overlay-time-status-renderer span#text').innerHTML.replace(/\s+/g, ' ').trim();
        let seconds = getDurationInSeconds(duration);
        total_time += seconds;
        v2.push({'name' : name, 'duration':duration, 'seconds':seconds, 'account': link});

        element.setAttribute('ytplstatslibrary-name', name);
    });




    let grp = v2.reduce(function(prev, value){
        account = value.account;
        found = prev.findIndex(element => element.account == account);
        if(found < 0)
        {
            value.nbr = 1;
            prev.push(value);
        }
        else
        {
            prev[found].nbr += 1;
            prev[found].seconds += value.seconds;
            prev[found].duration = getDurationInTimeFormat(prev[found].seconds);
        }

        return prev;
    }, []);


    grp.sort((a,b) => b.nbr - a.nbr);


    stats = document.querySelectorAll('.immersive-header-content .metadata-wrapper')[0];
    if(!document.getElementById("ytplstatslibrary"))
    {
        let dashboard = document.createElement('div');
        dashboard.id = "ytplstatslibrary";
        dashboard.style.cssText += 'font-size:1.4rem;';
        stats.appendChild(dashboard);
    }

    dashboard = document.getElementById('ytplstatslibrary');
    dashboard.innerHTML = "";
    dashboard.innerHTML = "Total time: " + getDurationInTimeFormat(total_time) + "<br/>";
    dashboard.innerHTML += "<input type=text onInput=ytstats_filter(event) /><br/>";
    dashboard.innerHTML += "<br/><div style='font-weight:bold'>Top 10 by videos</div>";

    grp.sort((a,b) => b.nbr - a.nbr);
    for (let index = 0; index < 10; index++) {
        const element = grp[index];
        if(element)
        {
            dashboard.innerHTML += "<span style=\"cursor:pointer;\" onclick=\"window.ytstats_highlightChannel('"+element.name+"')\">"+element.name + ": " + element.nbr + "</span><br/>";
        }

    }

    dashboard.innerHTML += "<br/><div style='font-weight:bold'>Top 10 by duration</div>";

    grp.sort((a,b) => b.seconds - a.seconds);
    for (let index = 0; index < 10; index++) {
        const element = grp[index];
        if(element)
        {
            dashboard.innerHTML += "<span style=\"cursor:pointer;\" onclick=\"window.ytstats_highlightChannel('"+element.name+"')\">"+element.name + ": " + element.duration + "</span><br/>";
        }
    }
}


init();


