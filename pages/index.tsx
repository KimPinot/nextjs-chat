import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUserContext } from "hooks/useUserContext";
import { Room } from "types/rooms";

async function getMyRooms(user_id: string) {
  const response = await fetch(`http://localhost:3000/api/room?user_id=${user_id}`, {
    method: "GET",
  });
  return await response.json();
}

const Home: NextPage = () => {
  const { push } = useRouter();
  const { userId, logout } = useUserContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!userId) return;
    getMyRooms(userId).then((response) => setRooms(response));
  }, [userId]);

  async function handleRoomCreate() {
    // create room
    const response = await fetch("http://localhost:3000/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "694bedd3-8776-40fe-be5a-584d1021ebae",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setRoomId(data.room_id);
      if (inputRef.current) {
        inputRef.current.value = data.room_id;
      }
    }
  }

  async function handleRoomJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputRef.current) await push(`/room/${inputRef.current.value}`);
  }

  return (
    <>
      <Head>
        <title>Socket.io connect example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"flex flex-col gap-y-2 p-4 w-full h-screen border-gray-200"}>
        {!!userId ? (
          <>
            <span className={"px-4 py-2"}>{userId.slice(0, 8)}으로 로그인 되었습니다.</span>
            <Link href={"/profile"}>
              <a className={"px-4 py-2 bg-gray-200 rounded-md text-center"}>프로필 관리하기</a>
            </Link>
            <button onClick={logout} className={"px-4 py-2 bg-gray-200 rounded-md"}>
              로그아웃하기
            </button>
          </>
        ) : (
          <Link href={"/login"}>
            <a className={"px-4 py-2 bg-gray-200 rounded-md text-center"}>로그인하기</a>
          </Link>
        )}
        <button onClick={handleRoomCreate} className={"px-4 py-2 bg-gray-200 rounded-md"}>
          채팅방 생성하기
        </button>
        <div className={"px-4 py-2 border-2 rounded-md"}>최근 생성된 채팅방 ID : {roomId}</div>
        <form onSubmit={handleRoomJoin} className={"flex gap-2"}>
          <input
            ref={inputRef}
            className={"flex-1 border-2 px-4 rounded-md"}
            type="text"
            name={"room_id"}
            placeholder={"채팅방 ID"}
          />
          <button className={"px-4 py-2 bg-gray-200 rounded-md"}>이 채팅방에 접속하기</button>
        </form>
        <div className={"flex flex-col gap-y-2"}>
          <h1 className={"text-xl"}>내가 접속한 채팅방</h1>
          {rooms.map((room) => (
            <button
              onClick={() => push(`/room/${room.id}`)}
              className={"px-4 py-2 bg-gray-200 rounded-md"}
              key={room.id}
            >
              {room.title} ({room.id.slice(0, 8)}) 에 접속하기
            </button>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
