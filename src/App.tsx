import { useState } from 'react'
import './App.css'

type Character = {
  readonly id: number;
  name: string;
  hp: number;
  atk: number;
  life: boolean;
  tagetFlg: boolean;
}



function App() {

  const [text,setText] = useState<string>('名前');
  const [hp,setHp] = useState<number>(30);
  const [atk,setAtk] = useState<number>(10);
  const [damage,setDamage] = useState<number>(0);
  const [characters,setCharacters] = useState<Character[]>([]);
  const [targetCharacter,setTargetCharacter] = useState<Character>();
  const [attackCharacter,setAttackCharacter] = useState<Character>();



  const characterSet = (name:string,hp:number,atk:number) => {
    const newCharacter: Character = {
      id: new Date().getTime(),
      name: name,
      hp: hp,
      atk: atk,
      life: true,
      tagetFlg: false,
    };
    setCharacters((characters) => [newCharacter, ...characters]);
    if(!attackCharacter){
      AttackSet({attackCharacter:newCharacter});
    }
  };

  const targetSet = (targetCharacter:Character) => {
    const newCharacters: Character[] = characters.map((character) => {
    if(character.id === targetCharacter.id && attackCharacter?.id !== targetCharacter.id){
      setTargetCharacter(targetCharacter);
      targetCharacter.tagetFlg = true;
    }else{
      character.tagetFlg = false;
    }
    return character;});
    setCharacters(newCharacters);
  }

  function AttackSet(prop:{attackCharacter:Character}){
    setAttackCharacter(prop.attackCharacter);
    setDamage(prop.attackCharacter.atk);
    return(<>{prop.attackCharacter.name} 攻撃力:{prop.attackCharacter.atk}
    </>);
  }

  function Characters(prop: { character: Character }) {
    const { character } = prop;
  
    if (character.tagetFlg) {
      return (
        <>
          {character.name} HP:{character.hp} ターゲット
        </>
      );
    } else if (character.id === attackCharacter?.id) {
      return (
        <>
          {character.name} HP:{character.hp} アタッカー
        </>
      );
    } else {
      return (
        <>
          {character.name} HP:{character.hp}
          <button
            onClick={(event) => {
              event.stopPropagation();
              targetSet(character);
            }}
          >
            狙う
          </button>
        </>
      );
    }
  }
  
  const attack = () => {
    if (targetCharacter) {
      setCharacters((characters) => {
        const newCharacters: Character[] = characters.map((character) => {
          if (character.id === targetCharacter.id && character.id !== attackCharacter?.id) {
            const calc = Math.random();
            const dmg: number = Math.floor(damage * calc);
  
            if (character.hp - dmg <= 0) {
              return { ...character, hp: 0, life: false, tagetFlg: false };
            }
  
            setAttackCharacter(targetCharacter);
            return { ...character, hp: character.hp - dmg, tagetFlg: false };
          }
          return character;
        });
        return newCharacters;
      });
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    characterSet(text, hp, atk);
  };

  return (
    <>
    <h1>ルール</h1>
    <div>
      <p>1.キャラクターを追加する</p>
      <p>2.狙うボタンを押してターゲットを選択する</p>
      <p>3.攻撃ボタンを押して攻撃（攻撃倍率は0~1倍）</p>
      <p>4.攻撃を受けた人が次に攻撃できる</p>
    </div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <input type="number"
        value={hp}
        onChange={(event) => setHp(Number(event.target.value))}
         />
      <input type="number"
        value={atk}
        onChange={(event) => setAtk(Number(event.target.value))}/>

      <input type="submit" value="キャラクターを追加" onSubmit={()=>characterSet(text,hp,atk)} />

    </form>
      <h1>バトルロイヤル</h1>
      <ul>
        {characters.map((character) => {
          if (character.life === true) {
            return <li key={character.id}>
                      <Characters character={character}/>
                  </li>;
          }
        })}
      </ul>
      {attackCharacter && (
        <div>
          {attackCharacter.name} 攻撃力:{attackCharacter.atk}
          <button onClick={(event) => {
            event.stopPropagation();
            attack();
          }}>攻撃</button>
        </div>
      )}
    </>
  )
}

export default App
