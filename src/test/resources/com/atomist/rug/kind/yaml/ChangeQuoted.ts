import {Project, File} from "@atomist/rug/model/Core";
import {Editor} from "@atomist/rug/operations/Decorators";
import {PathExpression, TextTreeNode, TypeProvider, PathExpressionEngine} from "@atomist/rug/tree/PathExpression";
import * as yaml from "@atomist/rug/ast/yaml/Types";
import {YamlPathExpressionEngine} from "@atomist/rug/ast/yaml/YamlPathExpressionEngine";

@Editor("Change quoted")
class ChangeQuoted  {

    edit(project: Project) {
        let eng: PathExpressionEngine =
            new YamlPathExpressionEngine(project.context.pathExpressionEngine)

        let findDependencies = `/*[@name='x.yml']/YamlFile()/dependencies/*[contains(., "Bohemian")]`

        eng.with<yaml.YamlString>(project, findDependencies, yamlValue => {
            // console.log(`Raw value is [${ymlValue.value()}]`)
            if (yamlValue.value() != `"Bohemian Rhapsody"`)
                throw new Error(`[${yamlValue.value()}] doesn't contain "`)
            if (yamlValue.text() != "Bohemian Rhapsody")
                throw new Error(`[${yamlValue.text()}] DOES contain "`)

            yamlValue.updateText("White Rabbit")
            // console.log(`${this.description}: updated text value is [${yamlValue.text()}]`)
        })
    }

}

export let editor = new ChangeQuoted()
