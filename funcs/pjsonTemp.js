const scripts = {

    dev: "node --watch index.js",
    start: "node index.js"

}

export const pjsonTemp = ({ name, description, author, module }) => {
    let temp = {
        name: name,
        description: description,
        author: author,
        module: module === "commonjs" ? "commonjs" : "module",
        scripts: scripts,
        keywords: [],
        lisence: "ISC",
        devDependencies: {
            
        }
    }
    return temp;
}