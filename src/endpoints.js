const URL = import.meta.env.VITE_URL;

export const createRole = async roleToCreate => {
    // try {
    //     const response = await fetch(`${URL}/api/roles`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: roleToCreate,
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         return data;
    //     } else {
    //         const errorData = await response.json();
    //         return errorData;
    //     }
    // } catch (error) {
    //     return 'Request error: ' + error.message;
    // }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(roleToCreate);
        }, 500);
    });
}

export const updateRole = async listOfRoles => {
    // try {
    //     const response = await fetch(`${URL}/api/roles`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: listOfRoles,
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         return data;
    //     } else {
    //         const errorData = await response.json();
    //         return errorData;
    //     }
    // } catch (error) {
    //     return 'Request error: ' + error.message;
    // }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(listOfRoles);
        }, 500);
    });
}

export const removeRole = async roleToDelete => {
    // try {
    //     const response = await fetch(`${URL}/api/roles/${roleToDelete}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (response.ok) {
    //         const data = await response.json();
    //         return data;
    //     } else {
    //         const errorData = await response.json();
    //         return errorData;
    //     }
    // } catch (error) {
    //     return 'Request error: ' + error.message;
    // }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(roleToDelete);
        }, 500);
    });
}