import React from 'react';
import { useParams } from 'react-router-dom';

function Stundent() {

    const {studentId} = useParams();

  return (
    <div className='text-center'>
      In test only adding student and listing is mentioned so performed that already but,
      all the Student related operation will take place here and we can use its id {studentId} to do that.
    </div>
  );
}

export default Stundent;
