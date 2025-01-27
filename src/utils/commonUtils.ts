

export const checkUserLoggedIn = (userId: string | undefined) => {
    if (!userId) {
        throw new Error('You must logged in!');
    }
}

export const checkUserIsAuthor = (role: string | undefined) => {
    if(role === 'Reader'){
        throw new Error('Sorry! you are not allowed to create post.');
    }
}