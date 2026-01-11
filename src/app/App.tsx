import { TestimonialCard } from '@/shared/ui/testimonial-card';

function App() {
  return (
    <div className="flex justify-center items-start min-h-screen pt-[200px] px-[17.5px] bg-gradient-to-br from-gray-100 via-gray-100 to-gray-200">
      <TestimonialCard
        authorName="Sarah Dole"
        authorUsername="@sarahdole"
        authorImage="https://vaqybtnqyonvlwtskzmv.supabase.co/storage/v1/object/public/projects-images/testimonial-card/starter/img/profile-thumbnail.jpg"
        testimonialText="I've been searching for high-quality abstract images for my design projects, and I'm thrilled to have found this platform. The variety and depth of creativity are astounding!"
      />
    </div>
  );
}

export default App;
