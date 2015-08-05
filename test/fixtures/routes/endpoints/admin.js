
'use strict';




module.exports = [


    {
        method: 'GET',
        path: '/',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/routes',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/collectionNames',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/config',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/node',
        config: { }
    },
    {
        method: 'GET',
        path: '/admin/versions',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/schemas/{schemaName}/{recType?}',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/schemas',
        config: {}
    },
    {
        method: 'POST',
        path: '/admin/schemas',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/schemas/list',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/methods/{methodParent?}',
        config: {}
    },
    {
        method: 'GET',
        path: '/admin/methods/{methodParent}/{methodName}',
        config: {}
    }

];
