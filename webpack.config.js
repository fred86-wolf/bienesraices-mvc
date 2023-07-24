import path from 'path'
export default{
    mode:'development',
    entry:{
        map:'./src/js/map.js',
        addImage:'./src/js/addImage.js',
        viewMap:'./src/js/viewMap.js',
        mapStart:'./src/js/mapStart.js',
        changeStatus:'./src/js/changeStatus.js'
    },
    output:{
        filename:'[name].js',
        path: path.resolve('public/js')
    }
}