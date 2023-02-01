/* groovylint-disable CompileStatic, ConfusingTernary, DuplicateStringLiteral, LineLength, NestedBlockDepth */
pipeline {
    agent {
        node {
            label 'sbar-jenkins-ci-agent'
        }
    }

    environment {
        repo_name = 'sbar-module-federation-test-host-app'
        git_branch = GIT_BRANCH.replaceAll('origin/', '')
        git_commit_sha = GIT_COMMIT.substring(0, 11)
    }

    stages {
        // TODO Testing Stages

        stage('Build docker image') {
            steps {
                script {
                    env.sbar_environment = 'uat'
                    env.img_repo = "dzo.sw.sbc.space/tot_dev/ci90000432_sbar_dev/$repo_name"
                    env.img_tag = "${env.TAG_NAME != null ? env.TAG_NAME : git_branch + '-' + git_commit_sha}"

                    if (env.TAG_NAME != null && !env.TAG_NAME.contains('rc')) {
                        env.sbar_environment = 'prom'
                        env.img_repo = "dzo.sw.sbc.space/tot/ci90000432_sbar/$repo_name"
                    }

                    sh 'printenv'

                    if (env.TAG_NAME != null) {
                        echo '### CI triggered by the TAG ###'
                        echo env.TAG_NAME
                        sh "docker build -t $env.img_repo:$env.img_tag ."
                    } else {
                        echo '### CI triggered by BRANCH ###'
                        echo env.BRANCH_NAME
                        sh "docker build -t $env.img_repo:$git_branch-latest -t $env.img_repo:$env.img_tag ."
                    }
                }
            }
        }

        stage('Push docker image to private registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'sbar-nexus-cd-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh "docker login -u $USERNAME -p $PASSWORD dzo.sw.sbc.space"
                    }
                    if (env.sbar_environment == 'uat' && env.TAG_NAME == null) {
                        sh "docker push '${env.img_repo}':'${git_branch}'-latest"
                    }
                    sh "docker push '${env.img_repo}':'${env.img_tag}'"
                }
            }
        }

        stage('Trigger Jenkins CD job') {
            steps {
                script {
                    if (env.sbar_environment == 'prom') {
                        input id: 'ApproveAndDeployToPROM', message: "Do you want to deploy $repo_name $env.img_tag into PROM?"
                    }
                    withCredentials([
                        usernamePassword(credentialsId: 'sbar-jenkins-cd-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'sbar-jenkins-cd-token', variable: 'TOKEN')
                    ]) {
                        triggerRemoteJob auth: CredentialsAuth(credentials: 'sbar-jenkins-cd-creds'),
                        job: "https://dzo.sw.sbc.space/jenkins-cd/job/sbar/job/$repo_name-cd",
                        blockBuildUntilComplete: true,
                        token: "$TOKEN",
                        maxConn: 3,
                        parameters: """
                            CI_ENV=${env.sbar_environment}
                            CI_IMG_REPO=${env.img_repo}
                            CI_IMG_TAG=${env.img_tag}
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                if (env.sbar_environment == 'uat' && env.TAG_NAME == null) {
                    sh "docker rmi '${env.img_repo}':'${git_branch}'-latest"
                }
                sh "docker rmi '${env.img_repo}':'${env.img_tag}'"
            }
        }
        always {
            sh 'docker logout dzo.sw.sbc.space'
        }
    }
}
