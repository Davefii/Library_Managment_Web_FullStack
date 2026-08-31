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
        `${API_URL}ListMembers`,
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

// GET MEMBER By ID
export async function getMemberByID(ID) {

    const response = await fetch(
        `${API_URL}GetMemberBy${ID}`,
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
                Name: member.name,
                Phone: member.phone,
                Address: member.address,
                MembershipExpiryDate: member.membershipExpiryDate
            })
        }
    );

    return await handleResponse(response);
}


// UPDATE CURRENT MEMBER
export async function updateMyInformation(member) {

    const response = await fetch(
        `${API_URL}UpdateMyInformationMember`,
        {
            method: "PUT",
            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                Name: member.name,
                Phone: member.phone,
                Address: member.address
            })
        }
    );

    return await handleResponse(response);
}


// DELETE MEMBER
export async function deleteMember(id) {

    const response = await fetch(
        `${API_URL}DeleteMemberBy${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    return await handleResponse(response);
}