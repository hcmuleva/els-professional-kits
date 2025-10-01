 How to Run the Test
Start the infrastructure (InfluxDB and Grafana):

bash
docker-compose up -d influxdb grafana
Run your k6 test and send results to InfluxDB:

bash
docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/test.js
View the results:

Open Grafana at http://localhost:3000

Log in with admin/admin

The pre-configured data source should be ready. You can import the k6 dashboard (ID: 2587) to visualize the results.


Steps to configure:
    1. modify url of server from const BASE_URL = __ENV.BASE_URL || 'http://192.168.18.16:1337/api';
 to your server (api server). this is in dev-test-devops/level2/performancetest/scripts/test.js
 2. open http://localhost:3000/  and login as admin/admin in this url ( you need to click on profile icon right top corner) 
 3. Click on Dashboard and create new dashboard . 

        In the Grafana menu, navigate to + > Import .

        In the Import via grafana.com field, enter the dashboard ID 2587 and click Load .

        On the next screen, select InfluxDB from the data source dropdown menu and click Import .
        url http://influxdb:8086, database name k6, username admin and password admin 
        Test and save.
4. run the test as docker-compose run --rm k6 run --out influxdb=http://influxdb:8086/k6 /scripts/test.js and it should show result in dashboard.