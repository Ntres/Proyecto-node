const form$$ = document.querySelector('[data-function="edit-form"]');

let image;
let logoUrl = '';

updateClient = async(id) => {
    event.preventDefault();
    console.log('id --> ', id);

    const companyName = form$$.querySelector('[name="companyName"]').value;
    const name = form$$.querySelector('[name="name"]').value;
    const lastName = form$$.querySelector('[name="lastName"]').value;
    const email = form$$.querySelector('[name="email"]').value;
    const phone = form$$.querySelector('[name="phone"]').value;
    const address = form$$.querySelector('[name="address"]').value;
    // const logoCompany = form$$.querySelector('[name="logoCompany"]').value;
    const cif = form$$.querySelector('[name="cif"]').value;

    await uploadToCloudinary(image);

    const client = {
        name: name,
        lastName: lastName,
        companyName: companyName,
        email: email,
        phone: phone,
        address: address,
        logoCompany: logoUrl,
        cif: cif
    };

    console.log('client antes de enviarlo --> ', client);

    const res = await fetch('http://localhost:3000/clients/edit/' + id, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(client)
    });

    alert('Cliente actualizado correctamente!');
    window.location.href = "/clients";
}

const uploadToCloudinary = async(logoCompany) => {
    const API_ENDPOINT = 'https://api.cloudinary.com/v1_1/dxkzb5mh2/upload';

    const fileData = new FormData();
    fileData.append('file', logoCompany);
    fileData.append('upload_preset', 'scuknbdf'); // upload preset

    await fetch(API_ENDPOINT, {
            method: 'post',
            body: fileData
        }).then(response => response.json())
        .then(data => {
            console.log('Success:', data)
            logoUrl = data.secure_url;
            console.log('logourl --> ', logoUrl);
        })
        .catch(err => console.error('Error:', err));
}

changeImage = (event) => {
    image = event.target.files[0];
}

deleteClient = async(id) => {
    await fetch('http://localhost:3000/clients/' + id, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    alert('Cliente borrado correctamente!');
    window.location.href = "/clients";

}