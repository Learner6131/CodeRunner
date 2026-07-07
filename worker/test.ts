import { DockerExecutor } from "./executor/DockerExecutor";

const executor = new DockerExecutor();

executor
  .execute({
    language: "cpp",
    code: `
#include<iostream>
using namespace std;

int main(){

int a,b;

cin>>a>>b;

cout<<a+b;

}
`,
    input: "10 20",
    submissionId: "123",
  })
  .then(console.log);
