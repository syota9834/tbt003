pipeline {
    agent any
    //「Global Tool Configuration」で設定したnameを指定
    tools { nodejs "node" }
    stages {
        stage('Frontend Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
    }
}
