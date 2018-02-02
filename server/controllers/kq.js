const dbhlper = require('../tools/dbhelper.js');
const KQSession = require('../lib/bgy-service').default;

/** 根据用户 ID 获取用户信息 */
async function getUserInfoById(userId){
  const [result] = await dbhlper.query('SELECT * FROM users WHERE id = ?', [ userId ]);
  return result;
}

/** 根据考勤 ID 获取用户信息 */
async function getUserInfoByKQID(kqid){
  const [result] = await dbhlper.query('SELECT * FROM users WHERE kqID = ?', [kqid]);
  return result;
}

/** 
 * 获取考勤会话 
 * @param {String} kqid 考勤ID
 */
async function getKQSession(kqid){
  const session = new KQSession(kqid);
  await session.init();
  return session;
}


/*
 *  考勤相关接口的 controller  
 */

module.exports = {

  /** 获取所有注册用户  */
  async getUsers(ctx){
    
    const result = await dbhlper.query('SELECT id, name FROM users');

    ctx.state.data = result;
  },

  /** 考勤打卡 */
  async check(ctx){
    const { userId, lng, lat } = ctx.request.body;

    if(!userId){
      throw "缺少参数 userId！";
    }

    const userInfo = await getUserInfoById(userId);

    if(!userInfo){
      throw `用户 ( ID: ${userId} ) 不存在！`;
    }

    const { kqID, deviceID, deviceType} = userInfo;
    const kqSession = await getKQSession(kqID);

    const { errno, errmsg} = await kqSession.check({
      deviceID,
      deviceType,
      lng,
      lat
    });

    if(errno == 0){
      ctx.state.data = null;
      return;
    }

    throw `考勤打卡失败： ${errmsg}`;
  },

  /** 添加或修改用户信息 */
  async saveUser(ctx){
    const userInfo = ctx.request.body;

    if (!userInfo.name || !userInfo.kqID || !userInfo.deviceID || userInfo.deviceType === undefined){
      throw '缺少接口参数！';
    }

    // 读取已经存在的用户，用于后续判断用户是否重复
    const existsUser = await getUserInfoByKQID(userInfo.kqID);

    if (userInfo.id){
      // 修改

      if (existsUser && existsUser.id != userInfo.id) {
        throw `考勤ID ( ${userInfo.kqID} ) 重复！`;
      }

      await dbhlper.query(
        'UPDATE users SET name= ?, kqID = ?, deviceID = ?, deviceType = ? WHERE id = ?', 
        [
          userInfo.name,
          userInfo.kqID,
          userInfo.deviceID,
          userInfo.deviceType,
          userInfo.id,
        ]
      );

      ctx.state.data = {
        id: userInfo.id,
        name: userInfo.name
      };
    }else{
      // 新增

      if (existsUser){
        throw `考勤ID ( ${userInfo.kqID} ) 已存在！`;
      }

      const { insertId } = await dbhlper.query(
        'INSERT INTO users SET ?',
        userInfo
      );
      ctx.state.data = {
        id: insertId,
        name: userInfo.name
      };
    }
  },

  /** 获取早退标识 */
  async getEarlyFlag(ctx){
    const {userId} = ctx.query;

    if (userId === undefined) {
      throw "缺少参数 userId！";
    }

    const userInfo = await getUserInfoById(userId);

    if (!userInfo){
      throw `用户 ( ID: ${userId} ) 不存在！`;
    }

    const kqSession = await getKQSession(userInfo.kqID);
    const isEarly = await kqSession.getEarlyFlag();

    ctx.state.data = { isEarly };
  }
}