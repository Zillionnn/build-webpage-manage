export default{
  url: process.env.url,
  fontSizeList: [
    {'name': 12, 'value': '12px'},
    {'name': 14, 'value': '14px'},
    {'name': 16, 'value': '16px'},
    {'name': 18, 'value': '18px'},
    {'name': 20, 'value': '20px'},
    {'name': 24, 'value': '24px'},
    {'name': 28, 'value': '28px'},

    {'name': 32, 'value': '32px'},
    {'name': 36, 'value': '36px'},

    {'name': 48, 'value': '48px'},

    {'name': 64, 'value': '64px'},
    {'name': 72, 'value': '72px'}
  ],

  eventTypeList: {
    text: [

      {
        label: '点击',
        value: 0
      },
      {
        label: '双击',
        value: 2
      }
    ],
    table: [
      {
        label: '点击单元格',
        value: 0
      },
      {
        label: '翻页',
        value: 1
      },
      {
        label: '双击单元格',
        value: 2
      }
    ]
  }
}
