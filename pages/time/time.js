Page({
  data: {
    timeOptions: [
      { value: 60 },
      { value: 90 },
      { value: 120 },
      { value: 240 }
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