const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    this.field = field;
    this.height = field.length
    this.width = field[0].length;
    for (let i = 0; i<this.height;i++) {
        for (let j=0; j<this.width;j++) {
            if (this.field[i][j]==pathCharacter) {
                this.currentPosition = {
                                            line: i,
                                            column: j,
                }
            }
        }
    }
  }

  set newMove(move) {
    switch(move) {
      case 'w' : this.currentPosition.line-=1;
      break;
      case 's' : this.currentPosition.line+=1;
      break;
      case 'a' : this.currentPosition.column-=1;
      break;
      case 'd' : this.currentPosition.column+=1;
      break;
      default : console.log(`command : ${move} not valid`)
    }
    if (this.currentPosition.line < 0 || this.currentPosition.line > this.height-1) {
      console.log('Game Over')
      process.exit()
    } else if (this.currentPosition.column < 0 || this.currentPosition.column > this.width-1) {
      console.log('Game Over')
      process.exit()
    } else if (this.field[this.currentPosition.line][this.currentPosition.column] == hole ) {
      console.log('Game Over')
      process.exit()
    } else if (this.field[this.currentPosition.line][this.currentPosition.column] == hat ) {
      console.log('Congrats!')
      process.exit()
    } else {
      this.field[this.currentPosition.line][this.currentPosition.column] = pathCharacter
    }
  } 

  print() {
      //console.clear won't work in codecademy terminal
    console.clear()
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  
  static generateField(line, column, holeRatio) {
    const randomField = () => {
      const newRandomField = [];
      for (let i = 0; i < line; i++) {
        let row = [];
        for (let j = 0; j < column; j++) {
          let randomNumber = Math.random();
          if (randomNumber < holeRatio) {
            row.push(hole);
          } else {
            row.push(fieldCharacter);
          }
        }
        newRandomField.push(row);
      }
      const hatIndex = [
        Math.floor(Math.random() * line),
        Math.floor(Math.random() * column),
      ];
      newRandomField[hatIndex[0]][hatIndex[1]] = hat;
      
      const startingPositions = [{
        xPos : Math.floor(Math.random() * column),
        yPos : Math.floor(Math.random() * line),
      }];
      newRandomField[startingPositions[0].yPos][startingPositions[0].xPos] = pathCharacter;
      return [newRandomField,startingPositions]
    }
    
    // console.log(newField)
    // console.log(fieldToTest)
    
    const clearPath = (positions,fieldToTest,count) => {
      let resolvable = false;
      let nextPositions = []
        for (const position of positions) {
          if (position.yPos+1 < line ) {
              switch(fieldToTest[position.yPos+1][position.xPos]) {
                  case fieldCharacter : fieldToTest[position.yPos+1][position.xPos] = pathCharacter;
                  nextPositions.push({xPos:position.xPos,yPos:position.yPos+1,});
                  break;
                  case hat : 
                  resolvable = true;
                  // console.log(`hat is line ${position.yPos+1} column ${position.xPos}/1` );
                  break;
              }
          }
          if (position.yPos-1 >= 0) {
              switch( fieldToTest[position.yPos-1][position.xPos]) {
                  case fieldCharacter : fieldToTest[position.yPos-1][position.xPos] = pathCharacter;
                  nextPositions.push({xPos:position.xPos,yPos:position.yPos-1,});
                  break;
                  case hat :
                      resolvable = true;
                      // console.log(`hat is line ${position.yPos-1} column ${position.xPos}/2` )
                      break;
              }
          }
          if (position.xPos+1 < column) {
              switch(fieldToTest[position.yPos][position.xPos+1]) {
                  case fieldCharacter : fieldToTest[position.yPos][position.xPos+1] = pathCharacter;
                  nextPositions.push({xPos:position.xPos+1,yPos:position.yPos,});
                  break;
                  case hat :
                      resolvable = true;
                      // console.log(`hat is line ${position.yPos} column ${position.xPos+1}/3` )
                      break;
              }
          }
          if (position.xPos-1 >= 0) {
              switch(fieldToTest[position.yPos][position.xPos-1]) {
                  case fieldCharacter :  
                  nextPositions.push({xPos:position.xPos-1,yPos:position.yPos,});
                  fieldToTest[position.yPos][position.xPos-1] = pathCharacter;
                  break;
                  case hat :
                      resolvable = true;
                      // console.log(`hat is line ${position.yPos} column ${position.xPos-1}/4` )
                      break;
                  }
              }
          }
          if (resolvable && count>Math.sqrt(line*column)*3) {
            // console.log('Resolution Possible')
            return true
          } else if (positions.length==0) {
            // console.log('impossible to resolve')
            return false
        }
          count ++
          return clearPath(nextPositions,fieldToTest,count)
    }
    //too recursive
    const verifyField = () => {
            let count = 0
            const [newRandomField,startingPositions] = randomField()
            const fieldToTest = JSON.parse(JSON.stringify(newRandomField));
            const validPath = clearPath(startingPositions,fieldToTest,count)
            if (validPath) {
              return newRandomField
            } else {
              return verifyField()
            }
    }
    
   const verifyField2 = () => {
    let validPath = false
    do {
      let count = 0
            const [newRandomField,startingPositions] = randomField()
            const fieldToTest = JSON.parse(JSON.stringify(newRandomField));
            let validPath = clearPath(startingPositions,fieldToTest,count)
            if (validPath) {
              return newRandomField
            } 
          } while (!validPath)
   } 
    const newField = verifyField2()
    return newField
    }
  }


const myMaze = new Field(Field.generateField(10,15,0.5));
myMaze.print();
process.stdout.write("Which way?")

process.stdin.on('data', (userInput) => {
  let input = userInput.toString().trim()
  myMaze.newMove = input
  myMaze.print();
  process.stdout.write("Which way?")
});