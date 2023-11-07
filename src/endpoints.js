const URL = import.meta.env.VITE_URL;

export const createRole = roleToCreate => {
    fetch(`${URL}/api/roles`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud');
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch(function (error) {
            console.error(error);
        });
}

export const updateRole = listOfRoles => listOfRoles

export const deleteRole = roleTodelete => roleTodelete