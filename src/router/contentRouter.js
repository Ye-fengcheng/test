

import dataList from '@/components/business/content/dataList'
import index from '@/components/business/common/null'
let router = [
    {
        path:'content',
        component:index,
        children:[
            {
                path:'dataList',
                component:dataList
            }
        ]
    }
]
export default router;