function makeChart1() {

    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        const data = new google.visualization.DataTable();
        data.addColumn('datetime','Time');
        data.addColumn('number','Wind');
        const barGraphValues = [];
        for(let k =0;k<8;k++){
            let year = new Date(weatherForecastArray[k]["from"]).getFullYear();
            let month = new Date(weatherForecastArray[k]["from"]).getMonth();
            let day = new Date(weatherForecastArray[k]["from"]).getDate();
            let hour = new Date(weatherForecastArray[k]["from"]).getHours();
            let minute = new Date(weatherForecastArray[k]["from"]).getMinutes();
            let time = new Date(year,month,day,hour,minute);
            let wind_speed = parseFloat(weatherForecastArray[k]["wind_speed"]);
            barGraphValues.push([time, wind_speed]);
        }
        data.addRows(barGraphValues);
        const options = {
            title: "Wind : 24 Hours (m/s)",
            backgroundColor: { fill:'transparent' },
            'width': 620,
            'height': 350,
            hAxis:{format: 'HH:mm',title : 'Time',gridlines : {color : 'none'},titleTextStyle : {color : 'white'},textStyle : {color : 'white'}},
            vAxis: {title : 'Wind (m/s)',gridlines : {color : 'none'},titleTextStyle : {color : 'white'},textStyle : {color : 'white'}},
            bar: {groupWidth: "55%"},
            titleTextStyle : {
                color : 'white'
            },
            colors : ['white'],
            legend: { position: "none" },
        };
        const barchart = new google.visualization.ColumnChart(document.getElementById("barchart"));
        barchart.draw(data, options);
    }
}

function makeChart2() {
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.load('current', {'packages':['line']});

    google.charts.setOnLoadCallback(drawChart);
          
    function drawChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Time');
        data.addColumn('number', 'Temperature');
        const lineChartValues = [];
        for(let k =0;k<8;k++){
            let year = new Date(weatherForecastArray[k]["from"]).getFullYear();
            let monthval = new Date(weatherForecastArray[k]["from"]).getMonth();
            let dayval = new Date(weatherForecastArray[k]["from"]).getDate();
            let hourval = new Date(weatherForecastArray[k]["from"]).getHours();
            let time = new Date(year,monthval,dayval,hourval);
            let temp = weatherForecastArray[k]["temp"];
            
            lineChartValues.push([time, temp]);
        }
  
        data.addRows(lineChartValues);

        const options = {
            vAxis: {title: 'Temperature', gridlines : {color : 'none'},titleTextStyle : {color : 'white'},textStyle : {color : 'white'}},
            hAxis: {title: 'Time', format: 'HH:mm', titleTextStyle : {color : 'white'},textStyle : {color : 'white'},gridlines : {color : 'none'}},
            titleTextStyle : {color : 'white'},
            title : 'Temperature vs Time',
            'width': 620,
            'height': 350,
            backgroundColor: { fill:'transparent' },
            legend : 'none',
            colors : ['white']
        };

        const linechart = new google.visualization.AreaChart(document.getElementById('linechart'));
        linechart.draw(data, options);
    }
}