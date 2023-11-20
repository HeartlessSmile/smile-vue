// import G6 from '@antv/g6';
import G6 from '@antv/g6/dist/g6.min.js'
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = '...'
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
  let currentWidth = 0
  let res = str
  const pattern = new RegExp('[\u4E00-\u9FA5]+') // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize)
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`
    }
  })
  return res
}
const layout = {
  rowMargin: 20, // 节点左右的间距
  columnMargin: 50, // 节点上下的间距
  cardWidth: 100,
  cardHeight: 30,
}
export default class MaG6 {
  constructor(config) {
    this.config = config // 配置信息
    this.id = config.id
    this.container = document.getElementById(this.id) // 外层元素
    this.data = config.data // 初始数据
    this.nodes = []
    this.edges = []
    this.nodesMap = {}
    this.hoverId = null
    this.canEdit = !this.config.disable
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.graph = null
    this.copyData = []
    this.maInterface = config.maInterface
    this.scrollBox = config.scrollBox ? document.getElementById(config.scrollBox) : null
    this.init()
  }

  init() {
    this.handleData(this.data)
    this.initRegisterNode()
    this.initGraph()
  }

  // 处理节点样式
  initRegisterNode() {
    let that = this
    G6.registerNode(
      'card',
      {
        drawShape: function drawShape(cfg, group) {
          const shape = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: 100,
              height: 36,
              radius: 4,
              fill: '#ccc',
            },
            name: 'card-box',
          })
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              fontSize: 14,
              x: 16,
              y: 10,
              lineHeight: 20,
              fill: 'rgba(0,0,0,0.88)',
              cursor: 'pointer',

              text: cfg.name,
            },
            name: 'title',
          })
          return shape
        },
        update(cfg, node) {
          const group = node.getContainer()
          group.clear()
          this.drawShape(cfg, group)
        },
      },
      'single-node'
    )
    G6.registerEdge(
      'hvh',
      {
        draw(cfg, group) {
          console.log(cfg)
          const start = that.nodesMap[cfg.source]
          const end = that.nodesMap[cfg.target]
          let startX = start.x + layout.cardWidth / 2
          let startY = start.y + layout.cardHeight + 16
          let endX = end.x + layout.cardWidth / 2
          let endY = end.y - 10
          let path = null
          if (startX == endX) {
            path = [
              ['M', startX, startY],
              ['L', endX, endY],
            ]
          } else if (startX > endX) {
            path = [
              ['M', startX, startY],
              ['C', startX - 30, startY + 30, endX + 30, endY - 30, endX, endY],
            ]
          } else {
            path = [
              ['M', startX, startY],
              ['C', startX + 30, startY + 30, endX - 30, endY - 30, endX, endY],
            ]
          }
          const shape = group.addShape('path', {
            attrs: {
              stroke: '#4075FD',
              path: path,
            },
            name: 'path-shape',
          })
          group.addShape('rect', {
            attrs: {
              width: 10,
              height: 10,
              fill: '#fff',
              stroke: '#4075FD',
              radius: 5,
              x: startX - 5,
              y: startY - 10,
            },
          })
          group.addShape('rect', {
            attrs: {
              width: 10,
              height: 10,
              fill: '#fff',
              stroke: '#4075FD',
              radius: 5,
              x: endX - 5,
              y: endY,
            },
          })

          return shape
        },
      },
      'cubic-vertical'
    )
  }

  handleData(data) {
    /******
     * 单个node节点
     *  x,y,width,height,type,id,pid,extraData
     */
    let arr = []
    let root = data[0]

    // 生成一个nodesMap 记录所有的节点 优化取数据逻辑
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (!this.nodesMap[item.id]) {
        this.nodesMap[item.id] = item
      }
    }

    let nodes = []
    let edges = []

    // 处理成一颗树
    // 深度优先遍历 处理节点的Y和当前节点需要的宽度
    const handleNode = (node, pid = '', y = 10) => {
      node.y = y
      node.height = layout.cardHeight
      node.width = layout.cardWidth
      node.pid = pid
      node.left = 0
      if (node.success && node.success.length > 0) {
        node.children = []
        // 父节点的y+父节点的height + 两者相距
        let needWidth = 0
        for (let i = 0; i < node.success.length; i++) {
          node.children[i] = handleNode(
            this.nodesMap[node.success[i]],
            node.id,
            y + layout.cardHeight + layout.columnMargin
          )
          edges.push({
            source: node.id,
            target: node.children[i].id,
          })
          needWidth += node.children[i].needWidth
        }
        node.needWidth = needWidth
      } else {
        node.needWidth = layout.rowMargin + layout.cardWidth
      }
      let maxH = node.height + node.y
      this.height = Math.max(maxH, this.height)
      nodes.unshift(node)
      return node
    }
    handleNode(root)
    this.handelX(root)
    console.log(root)
    this.copyData = JSON.parse(JSON.stringify(this.data))

    this.nodes = nodes
    this.edges = edges
  }

  handelX(node, left = 0) {
    let cur_arr = [node]
    let maxCardWidth = 0
    while (cur_arr.length > 0) {
      let curNode = cur_arr.shift()
      if (curNode.pid) {
        let parent = this.nodesMap[curNode.pid]
        let index = parent.children.findIndex((el) => el.id == curNode.id)
        if (index == 0) {
          curNode.preWidth = parent.preWidth
        } else {
          curNode.preWidth = parent.children[index - 1].preWidth + parent.children[index - 1].needWidth
        }
      } else {
        curNode.preWidth = 0
      }

      if (curNode.children && curNode.children.length > 0) {
        cur_arr = cur_arr.concat(curNode.children)
      }
      curNode.x = curNode.preWidth
      this.width = Math.max(this.width, curNode.preWidth + layout.cardWidth, this.container.offsetWidth)
      maxCardWidth = Math.max(maxCardWidth, curNode.preWidth + layout.cardWidth)
    }
    // 处理道中间
    cur_arr = [node]
    let startX = 0
    if (maxCardWidth < this.width) {
      startX = (this.width - maxCardWidth) / 2
    }
    while (cur_arr.length > 0) {
      let curNode = cur_arr.shift()
      curNode.x = curNode.preWidth + startX + curNode.needWidth / 2 - layout.cardWidth / 2
      if (curNode.children && curNode.children.length > 0) {
        cur_arr = cur_arr.concat(curNode.children)
      }
    }
  }

  //  初始化画布
  initGraph() {
    let height = Math.max(this.container.offsetHeight, this.height)
    this.graph = new G6.Graph({
      container: this.container,
      width: this.width,
      height: height,
      defaultNode: {
        type: 'card',
      },
      defaultEdge: {
        type: 'hvh',
      },
      // fitView: true, //自动适配画布大小。
      autoPaint: true,
      fitViewPadding: 40, // 指定四周留白
      // renderer: 'svg'
    })
    this.graph.read({ nodes: this.nodes, edges: this.edges })
    // this.addEvent()
  }

  destroy() {
    this.graph.destroy()
  }
}
