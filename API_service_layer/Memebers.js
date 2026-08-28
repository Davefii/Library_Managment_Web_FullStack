const API_URL = "https://localhost:7010/api/Members/";

async function handleResponse(response) {

    let body = null;

    try {
        body = await response.json();
    } catch {
        // Response has no JSON body
    }

    if (!response.ok) {
        throw new Error(
            body?.message ||
            body?.title ||
            `Request failed: ${response.status}`
        );
    }

    return body;
}


// GET ALL MEMBERS
export async function getMembers() {

    const response = await fetch(
        `${API_URL}ListMemebers`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// GET CURRENT MEMBER
export async function getMe() {

    const response = await fetch(
        `${API_URL}Me`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}


// ADD MEMBER
export async function addMember(member) {

    const response = await fetch(
        `${API_URL}AddMemeber`,
        {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: member.name,
                phone: member.phone,
                address: member.address,
                membershipExpiryDate: member.membershipExpiryDate
            })
        }
    );

    return await handleResponse(response);
}


// UPDATE CURRENT MEMBER
export async function updateMyInformation(member) {

    const response = await fetch(
        `${API_URL}UpdateMyInfomationMember`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: member.name,
                phone: member.phone,
                address: member.address,
                membershipExpiryDate: member.membershipExpiryDate
            })
        }
    );

    return await handleResponse(response);
}


// DELETE MEMBER
export async function deleteMember(id) {

    const response = await fetch(
        `${API_URL}DeleteMemeberBy${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}