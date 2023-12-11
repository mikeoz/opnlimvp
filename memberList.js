document.addEventListener('DOMContentLoaded', function() {
    fetch('/list-members')
        .then(response => response.json())
        .then(data => {
            const memberList = document.getElementById('members');
            data.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${member.person_id}, Name: ${member.first_name} ${member.middle_name} ${member.last_name}`;
                memberList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
});
