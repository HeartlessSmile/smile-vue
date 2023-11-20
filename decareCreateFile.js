import fs from 'fs'
import path from 'path'

// 命令行参数解析
import minimist from 'minimist'
// 命令行交互
import prompts from 'prompts'
import { red, green, bold, bgRed, bgGreen, yellow, bgYellow } from 'kolorist'

import { canSkipEmptying, toHump, emptyDir } from './src/utils/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

async function init() {
  // --------- 解析参数start ----------
  const argv = minimist(process.argv.slice(2), { boolean: ['force'] })

  let targetDir = argv._[0]

  // 不存在的话，默认'vue-project'
  let result = {}
  const defaultFilePath = '/Users/smile/Desktop/szyh/declare-page/src'
  const defaultProjectName = !targetDir ? 'smile-project' : targetDir
  // 是否强制覆盖当前重名的文件夹

  const midProjectPath = 'components/declare'
  const midApiPath = 'api'

  const forceOverwrite = argv.force

  // --------- 解析参数end ----------

  // --------- 命令行交互 start ---------

  try {
    let filePath = ''
    let fileName = ''
    result = await prompts(
      [
        // 创建文件夹的位置
        {
          type: 'text',
          name: 'filePath',
          message: '创建文件位置:',
          initial: defaultFilePath,
          validate: (value) => (fs.existsSync(value) ? true : '当前文件夹不存在'),
          onState: (state) => (filePath = String(state.value).trim() || defaultFilePath),
        },
        {
          type: 'text',
          name: 'fileName',
          message: '文件夹名称:',
          initial: defaultProjectName,
          validate: (value) => (value ? true : '当前参数必填'),
          onState: (state) => (fileName = String(state.value).trim()),
        },
        {
          name: 'shouldOverwrite',
          // 判断目录是否为空， canSkipEmptying（下面实现）
          type: () => (canSkipEmptying(filePath, fileName) || forceOverwrite ? null : 'confirm'),
          message: () => {
            return `${fileName} 已存在。 是否删除?`
          },
        },
        {
          type: 'toggle',
          name: 'hasApi',
          message: '是否创建API',
          initial: true,
          active: 'yes',
          inactive: 'no',
        },
        // {
        //   type: 'toggle',
        //   name: 'hasColumnCheck',
        //   message: '是否是多选表格',
        //   initial: true,
        //   active: 'yes',
        //   inactive: 'no',
        // },
        // {
        //   type: 'toggle',
        //   name: 'hasTool',
        //   message: '是否有工作栏',
        //   initial: true,
        //   active: 'yes',
        //   inactive: 'no',
        // },
      ],

      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作已退出')
        },
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  // --------- 命令行交互 end ---------
  const {
    fileName,
    filePath,
    hasApi = true,
    hasColumnCheck,
    hasTool,
    shouldOverwrite = argv.force,
  } = result

  const cwd = process.cwd()
  // 获取要创建工程的绝对路径
  const fileNamePath = path.join(filePath, midProjectPath, fileName)
  // 这里是真正判断是否要覆盖文件夹
  if (fs.existsSync(fileNamePath) && shouldOverwrite) {
    emptyDir(fileNamePath) // emptyDir清空文件夹后面实现
  } else if (!fs.existsSync(fileNamePath)) {
    fs.mkdirSync(fileNamePath)
  }

  const humpFileName = toHump(fileName)

  console.log('开始创建项目:', green(fileNamePath))

  const templateRoot = path.resolve(__dirname, 'pageTemplates')
  // 创建Api并且引入
  if (hasApi) {
    const apiPath = path.join(templateRoot, 'api.js')
    let apiName = humpFileName + 'Api'
    fs.copyFile(apiPath, path.join(filePath, midApiPath, apiName + '.js'), (err) => {})
    let apiIndexPath = path.join(filePath, midApiPath, 'index.js')
    let apiIndexContent = fs.readFileSync(apiIndexPath, 'utf-8')
    if (!apiIndexContent.includes(apiName)) {
      let exportIndex = apiIndexContent.indexOf('export')
      apiIndexContent =
        apiIndexContent.slice(0, exportIndex) +
        `import ${apiName} from './${apiName}.js'\n` +
        apiIndexContent.slice(exportIndex)

      let exportIndex2 = apiIndexContent.indexOf('export default {') + 16
      apiIndexContent = apiIndexContent.slice(0, exportIndex2) + `\n\t${apiName},` + apiIndexContent.slice(exportIndex2)
      fs.writeFileSync(apiIndexPath, apiIndexContent, 'utf-8')
      console.log(green(`创建${apiName} api成功`))
    } else {
      console.log(yellow(`api/index.js中已存在该${apiName} api`))
    }

  }

  // 读取模板内容
  let templatePath = path.join(templateRoot, 'index.vue')
  let templateContent = fs.readFileSync(templatePath, 'utf-8')
  templateContent = templateContent.replace('##fileName##', humpFileName)
  templateContent = templateContent.replace('##apiFileName##', humpFileName + 'Api')
  fs.writeFileSync(path.join(fileNamePath, 'index.vue'), templateContent, 'utf-8')
  console.log(`\n搭建工程完成 ${fileNamePath}...`)
}

init()
