

export function initZeroArray( len ) {
  let result = [];
  for (let i = 0; i < len; i++) {
    //result[i] = '0';
    result.push('0');
  }
  return result;
}


export function initZero(len) {
  return Array(len).fill('0');
}


export function initZeroMatrix( row, col ) {
  // * возвращ матрицу заполн "0"
  let result = [];
  for (let r = 0; r < row; r++) {
    result[r] = [];
    for (let c = 0; c < col; c++) {
      // result[r][c] = 0;
      result[r].push('0');
    }
  }
  return result;
}

