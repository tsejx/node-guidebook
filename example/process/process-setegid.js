if (process.getegid && process.setegid) {
    console.log(`当前的 gid: ${process.getegid()}`);
    try {
      process.setegid(501);
      console.log(`新的 gid: ${process.getegid()}`);
    } catch (err) {
      console.log(`无法设置 gid: ${err}`);
    }
  }