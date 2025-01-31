import {qGetReaders} from '../../controllers/admin/admin';


export const adminBlogResolver = {
    Query:{
        getReaders: qGetReaders
    },
}



