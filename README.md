# env0 tflint Plugin



This env0 tflint Plugin will allow you to run `tflint` analysis on an IaC directory as a part of your custom flow. To use this plugin, you will need to use version 2 of `env0.yml`.


Due to rate limits - we do not allow to use `tflint` with the latest version and we require a specific version to be passed.


## Inputs



The tflint plugin accepts the following inputs:

* `version` (required) - the specific version of tflint you wish to use 

* `directory` (required) - the path to the directory with the IaC code to analyze (the root folder is your project's root folder)

* `flags` - a string containing additional flags as one string


## Example Usage



In this example we will run `tflint` analysis on your root folder before the "Terraform Plan" step of a deploy. We will call that step "My Step Name":

```yaml
version: 2
deploy:
  steps:
    terraformPlan:
      before:
        - name: My Step Name # The name that will be presented in the UI for this step
          use: https://github.com/env0/env0-tflint-plugin
          inputs:
            version: v0.43.0
            directory: .

```



## Further Reading

You can read more about `tflint` and the available flags [here](https://github.com/terraform-linters/tflint#usage).