import React from 'react';

import styles from '../../css/index_react.scss'

console.log(styles);

export default (props)=> {
  let test = 'test2';
  return (
    <div className={styles.test}>
      React module2 aaa
    </div>
  )
}