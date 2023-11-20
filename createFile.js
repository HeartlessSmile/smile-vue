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

  // 不存在的话，默认'vue-project'
  let result = {}
  const filePath = path.resolve(__dirname, './src/views')

  // --------- 解析参数end ----------
  try {
    result = await prompts(
      [
        // 创建文件夹的位置
        {
          type: 'text',
          name: 'fileName',
          message: '文件夹名称:',
          validate: (value) => (value ? true : '必须输入文件夹名称'),
        },
        {
          type: 'text',
          name: 'menuName',
          message: '目录名称:',
          validate: (value) => (value ? true : '必须输入menu名称'),
        },
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

  let fileName = result.fileName
  let menuName = result.menuName

  // --------- 命令行交互 end ---------

  const cwd = process.cwd()
  // 获取要创建工程的绝对路径
  const fileNamePath = path.join(filePath, fileName)

  if (fs.existsSync(fileNamePath)) {
    console.log(red('文件夹已存在，请重新输入文件夹名'))
    return false
  }
  fs.mkdirSync(fileNamePath)

  const humpFileName = toHump(fileName)

  console.log('开始创建项目:', green(fileNamePath))

  let templateContent = fs.readFileSync(path.resolve(__dirname, './template/index.vue'), 'utf-8')
  templateContent = templateContent.replace('##fileName##', menuName)
  fs.writeFileSync(path.join(fileNamePath, 'index.vue'), templateContent, 'utf-8')
  console.log('模板创建成功...')

  let routerPath = path.resolve(__dirname, './src/router/index.js')
  let routerContent = fs.readFileSync(routerPath, 'utf-8')
  let tagStr = '// add-router'
  const routerIndex = routerContent.indexOf(tagStr) + tagStr.length
  routerContent =
    routerContent.slice(0, routerIndex) +
    `\n\t{ path: '/${fileName}', component: () => import('@/views/${fileName}/index.vue') },` +
    routerContent.slice(routerIndex)
  fs.writeFileSync(routerPath, routerContent, 'utf-8')
  console.log('路由添加成功...')

  let appPath = path.resolve(__dirname, './src/app.vue')
  let appContent = fs.readFileSync(appPath, 'utf-8')
  tagStr = '<!-- add-menu -->'
  const appIndex = appContent.indexOf(tagStr)
  appContent =
    appContent.slice(0, appIndex) +
    `<el-menu-item index="/${fileName}">
    <span>${menuName}</span>
  </el-menu-item>\n` +
    appContent.slice(appIndex)
  console.log(appContent)
  fs.writeFileSync(appPath, appContent, 'utf-8')
  console.log('添加目录成功...')

  console.log(`\n搭建工程完成 ${fileNamePath}...`)
}

init()
