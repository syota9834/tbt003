pipeline {
    agent any
    // 上記の「Global Tool Configuration」で設定したnameを指定
    tools { nodejs "node" }
    stages {
        stage('Install') {
            steps {
                dir ("${env.WORKSPACE}/src") {
                  sh 'npm install'
                }
            }
        }
        
        stage('Build') {
            steps {
                dir ("${env.WORKSPACE}/src") {
                  sh 'npm run build'
                }
            }
        }
    }
}
