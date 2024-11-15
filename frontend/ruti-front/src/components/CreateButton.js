import React from 'react';
import Button from 'react-bootstrap/Button';

class CreateButton extends React.Component {
  handleClick = async () => {
    const data = {
      // Tu objeto aquí
      key1: 'value1',
      key2: 'value2',
    };

    try {
      const response = await fetch('http://localhost:3000/routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Success:', jsonResponse);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>Enviar POST</Button>
      </div>
    );
  }
}

export default CreateButton;
