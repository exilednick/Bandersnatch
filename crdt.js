function cmp(a, b) {
  console.log(a,b);
  let i = 0, j = 0;
  while(i<a.length && j<b.length) {
    if(a[i]>b[j])
      return true;
    else if(b[j]>a[i])
      return false;
    i+=1;
    j+=1;
  }
  if(i!=a.length)
    return true;
  else
    return false;
}

function insertIndex(crdt, arrIndex) {
  for(let i = 1; i<crdt.length; i++) {
    if(cmp(crdt[i], arrIndex))
      return i-1;
  }
  return crdt.length-1;
}

function createIndex(crdt, index, id) {
  /* 0 -> null
     a-> 0,0,1 b-> 1,1,2,1
     0,1,1
     1,1,1
     1,1,2,1
     1,2,1
     2,1
     3,1

     1st case -> start
     2nd case -> between
     3rd case -> last
  */
  let ans =[]
  if(index == 0) {
    let val = crdt[1];
    for(let i = 0; i< val.length; i++) {
      if(val[i]!=0){
        ans.push(0);
        break;
      }
      else {
        ans.push(0);
      }
    }
  }
  else if(index == crdt.length-1)
    ans.push(crdt[crdt.length-1][0]+1);
  else {
    let val1 = crdt[index];
    let val2 = crdt[index+1];
    let i = 0; j = 0, cnt = 0;
    while(i<val1.length && j<val2.length)
    {
      if(val1[i]==val2[j])
        cnt+=1;
      else
        break;
      i+=1;
      j+=1;
    }
    if(cnt == val1.length) { //prefix matches val1
      ans = [...val1];
      for(let i = cnt; i< val2.length; i++) {
        if(val2[i]!=0){
          ans.push(0);
          break;
        }
        else {
          ans.push(0);
        }
      }
    }
    else if(cnt<val1.length) {
      ans = val1.slice(0,cnt);
      ans.push(val1[cnt]);
      ans.push(val1[cnt+1]+1);
    }
  }

  ans.push(id);
  return ans;
}

crdt = [[],
        [0,0,1],
        [0,1,1],
        [1,1,1],
        [1,2,1],
        [2,1],
        [3,1]]
console.log(insertIndex(crdt, [1,0,1,1]))
