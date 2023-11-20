let defaultData = [
  {
    id: 'node1',
    type: 'card',
    child: [
      {
        id: 'node2',
        type: 'card',
        child: [
          {
            id: 'node5',
            type: 'card',
            child: [],
          },
          {
            id: 'node6',
            type: 'card',
            child: [],
          },
        ],
      },
      {
        id: 'node3',
        type: 'card',
        child: [
          {
            id: 'node7',
            type: 'card',
            child: [],
          },
          {
            id: 'node8',
            type: 'card',
            child: [
              {
                id: 'node88',
                type: 'card',
                child: [],
              },
              {
                id: 'node89',
                type: 'card',
                child: [],
              },
              {
                id: 'node90',
                type: 'card',
                child: [],
              },
              {
                id: 'node91',
                type: 'card',
                child: [],
              }
            ],
          },
        ],
      },
      {
        id: 'node4',
        type: 'card',
        child: [
          {
            id: 'node9',
            type: 'card',
            child: [
              {
                id: 'node11',
                type: 'card',
                child: [],
              },
            ],
          },
          {
            id: 'node10',
            type: 'card',
            child: [],
          },
        ],
      },
    ],
  },
]

let arr = []

function handleData(data, pid = 0) {
  for (let i = 0; i < data.length; i++) {
    const { id, type, child = [] } = data[i]
    arr.push({ id, type, name: id, success: (child || []).map((item) => item.id) })
    if (child.length > 0) {
      handleData(child, id)
    }
  }
}

handleData(defaultData)

export default arr
console.log(JSON.stringify(arr))
