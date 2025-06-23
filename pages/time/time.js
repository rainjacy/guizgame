Page({
  data: {
    timeOptions: [
      { value: 15 },
      { value: 30 },
      { value: 60 },
      { value: 90 },
      { value: 180 },
      { value: 360 }
    ],
    selected: 2 // 默认选中60秒
  },
  selectTime(e) {
    this.setData({ selected: e.currentTarget.dataset.index });
  },
  confirm() {
    const selectedTime = this.data.timeOptions[this.data.selected].value;
    wx.setStorageSync('wordTime', selectedTime);
    wx.navigateTo({ url: '/pages/wordbank/wordbank' });
  }
}) 