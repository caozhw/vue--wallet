import Home from './views/Home.vue'
import Login from './views/Login.vue'
//平台钱包管理  
import UserChargeAddressList from './views/platformWallet/UserChargeAddressList.vue'
import WalletAddressDetail from './views/platformWallet/WalletAddressDetail.vue'

import UserWithdrawAddressList from './views/platformWallet/UserWithdrawAddressList.vue'

import WalletTransInList from './views/platformWallet/WalletTransInList.vue'

import WalletTransOutList from './views/platformWallet/WalletTransOutList.vue'
import WalletTransOutDetail from './views/platformWallet/WalletTransOutDetail.vue'
import WalletTransOutModify from './views/platformWallet/WalletTransOutModify.vue'

import WalletTransInOutStat from './views/platformWallet/WalletTransInOutStat.vue'
import WalletTypeList from './views/platformWallet/WalletTypeList.vue'
import WalletTypeModify from './views/platformWallet/WalletTypeModify.vue'

//系统钱包管理 
import SystemTransferRecord from './views/systemWallet/SystemTransferRecord.vue'
import SystemTransferManagement from './views/systemWallet/SystemTransferManagement.vue'
import WalletAddressModify from './views/systemWallet/WalletAddressModify.vue'  
import WalletTransSettingsList from './views/systemWallet/WalletTransSettingsList.vue'
import WalletTransOutPlatStat from './views/systemWallet/WalletTransOutPlatStat.vue'
import WalletBalanceStat from './views/systemWallet/WalletBalanceStat.vue'

//对账管理
import WalletCheckInOutStat from './views/WalletCheck/WalletCheckInOutStat.vue'
import WalletCheckInList from './views/WalletCheck/WalletCheckInList.vue'
import WalletCheckOutList from './views/WalletCheck/WalletCheckOutList.vue'
import WalletCheckAddressStat from './views/WalletCheck/WalletCheckAddressStat.vue'
import WalletCheckAddressList from './views/WalletCheck/WalletCheckAddressList.vue'
import WalletLastBlock from './views/WalletCheck/WalletLastBlock.vue'
import WalletInOutFlow from './views/WalletCheck/WalletInOutFlow.vue'

//监控管理
import WalletMonitorList from './views/WalletMonitor/WalletMonitorList.vue'

//系统管理
import WalletAdminPower from './views/WalletAdmin/WalletAdminPower.vue'
import WalletAdminUserAddOrModify from './views/WalletAdmin/WalletAdminUserAddOrModify.vue'

import base from './views/base/base.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
   /* {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },*/
    //{ path: '/main', component: Main },
    

    {
        path: '/',
        component: Home,
        name: '平台钱包管理',
        iconCls: '',//图标样式class 
        children: [
            { path: '/base', component: base, name:'base' },
            { path: '/UserChargeAddressList', component: UserChargeAddressList, name: ' 用户充币地址列表'},
            { path: '/WalletAddressDetail', component: WalletAddressDetail, name: ' 用户充币地址详情',hidden: true},
            { path: '/UserWithdrawAddressList', component: UserWithdrawAddressList, name: '用户提币地址列表'},
            { path: '/WalletTransInList', component: WalletTransInList, name: '用户充币记录'},
            { path: '/WalletTransOutList', component: WalletTransOutList, name: '用户提币记录'},
            { path: '/WalletTransOutDetail', component: WalletTransOutDetail, name: '用户提币详情',hidden: true},
            { path: '/WalletTransOutModify', component: WalletTransOutModify, name: '用户提币审核',hidden: true},
            { path: '/WalletTransInOutStat', component: WalletTransInOutStat, name: '平台充提统计'},
            { path: '/WalletTypeList', component: WalletTypeList, name: '平台币种管理'},
            { path: '/WalletTypeModify', component: WalletTypeModify, name: '平台币种编辑',hidden: true},
            //{ path: '/WalletTransOutPlatStat', component: WalletTransOutPlatStat, name: '平台币种设置',hidden: true},
           
           
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统钱包管理',
        iconCls: '',//图标样式class
        children: [
            { path: '/SystemTransferRecord', component: SystemTransferRecord, name: '系统转账记录'},
            { path: '/SystemTransferManagement', component: SystemTransferManagement, name: '系统钱包管理' },
            { path: '/WalletAddressModify', component: WalletAddressModify, name: '热钱包账户编辑',hidden: true},
            { path: '/WalletTransSettingsList', component: WalletTransSettingsList, name: '系统转账设置'},//提现预警
            { path: '/WalletTransOutPlatStat', component: WalletTransOutPlatStat, name: '系统转账统计'},
            { path: '/WalletBalanceStat', component: WalletBalanceStat, name: '系统钱包余额查询'},
           
        ]
    },
    {
        path: '/',
        component: Home,
        name: '对账管理',
        iconCls: '',//图标样式class  
        children: [
            { path: '/WalletCheckInOutStat', component: WalletCheckInOutStat, name: '交易平台对账'},
            { path: '/WalletCheckInList', component: WalletCheckInList, name: '充币对账详情',hidden: true},
            { path: '/WalletCheckOutList', component: WalletCheckOutList, name: '提币对账详情',hidden: true},
            { path: '/WalletCheckAddressStat', component: WalletCheckAddressStat, name: '区块链对账'},
            { path: '/WalletCheckAddressList', component: WalletCheckAddressList, name: '区块链余额对账详情',hidden: true},
            { path: '/WalletInOutFlow', component: WalletInOutFlow, name: '账户地址查询'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '监控管理',
        iconCls: '',//图标样式class  
        children: [
            { path: '/WalletMonitorList', component: WalletMonitorList, name: '监控分析平台'}, 
         ]  
    },

    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: '',//图标样式class  
        children: [
            { path: '/WalletAdminPower', component: WalletAdminPower, name: '权限管理'}, 
            { path: '/WalletAdminUserAddOrModify', component: WalletAdminUserAddOrModify, name: '管理员设置'}, 
         ]  
    },

    /*{
        path: '/',
        component: Home, 
        name: '币种查询',
        iconCls: '',//图标样式class  
        children: [
            { path: '/WalletLastBlock', component: WalletLastBlock, name: '币种查询'},  
        ]
    },*/
    /*{
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: '',//图标样式class
        children: [
           
        ]
    },*/
];

export default routes;