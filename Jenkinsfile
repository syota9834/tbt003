pipeline {
    agent any
    //「Global Tool Configuration」で設定したnameを指定
    tools { nodejs "node" }
    stages {
        stage('Frontend Install & Build') {
            steps {
                dir('frontend') {
    		    sh '''
      		      npm install
      	              node node_modules/typescript/bin/tsc
                      node node_modules/vite/bin/vite.js build
    	            '''
		        }
            }
        }
        stage('Frontend Deploy to Apache') {
            steps {
                sh '''
                sudo rm -rf /var/www/html/*
                sudo cp -r frontend/dist/* /var/www/html/
                '''
            }
        }
    }
}
