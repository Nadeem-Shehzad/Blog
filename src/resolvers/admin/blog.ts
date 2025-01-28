import {qGetReaders} from '../../controllers/admin/blog';


export const adminBlogResolver = {
    Query:{
        getReaders: qGetReaders
    },
}



