import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Option } from 'lucide-react';
import React from 'react';

const Home = () => {
  return (
    <div className="flex h-screen">
      <aside className="bg-zinc-900 p-4 w-1/6 flex flex-col">
        <h2 className="text-sm font-semibold text-white">Sidebar</h2>
        <ul>
          <li className="my-1 text-sm text-white">Menu Item 1</li>
          <li className="my-1 text-sm text-white">Menu Item 2</li>
          <li className="my-1 text-sm text-white">Menu Item 3</li>
          <li className="my-1 text-sm text-white">Menu Item 4</li>
        </ul>
        <div className="mt-auto space-y-2">
          <Button className="w-full p-2 text-gray-500  bg-accent hover:bg-white">
            Share
          </Button>
          <Button className="w-full text-gray-500 p-2 bg-white hover:bg-blue-500 hover:text-white">
            Dontaion
          </Button>
          <Button className="w-full text-gray-500 p-2 bg-white hover:bg-accent">
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-col w-5/6">
        <header className="flex items-center bg-blue-500 font-bold text-lg p-4 ">
          <Option className="mr-2" /> Optimize
          <div className="flex ml-4">
            <Input
              placeholder="Enter Url or search by title jksadjasdasdasdlksaldjl"
              className="border-none bg-accent "
            />
            <Input
              placeholder="Enter Url or search by title"
              className="ml-4 border-none bg-accent"
            />
            <Button type="submit" className="ml-4">
              Run/Fetch
            </Button>
          </div>
        </header>

        <div className="flex flex-1">
          <section className="bg-white p-4 shadow w-2/3">
            Content Section 1 (Larger)
          </section>
          <section className="bg-white p-4 shadow w-1/3">
            Content Section 2 (Smaller)
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
