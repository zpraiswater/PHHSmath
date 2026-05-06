-- College Algebra Final Review Dashboard schema + RLS
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('student','teacher')) default 'student',
  created_at timestamptz default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text default '#3b82f6',
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  question_text text not null,
  answer_choice_a text not null,
  answer_choice_b text not null,
  answer_choice_c text not null,
  answer_choice_d text not null,
  correct_answer text not null check (correct_answer in ('A','B','C','D')),
  explanation text,
  difficulty text,
  misconception_notes text,
  created_at timestamptz default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  created_at timestamptz default now()
);

create table if not exists mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  attempts_count int not null default 0,
  correct_count int not null default 0,
  accuracy numeric generated always as (case when attempts_count = 0 then 0 else (correct_count::numeric / attempts_count::numeric) * 100 end) stored,
  status text not null default 'Not Started',
  unique(student_id, topic_id)
);

alter table profiles enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table mastery enable row level security;

create policy "profiles self read" on profiles for select using (auth.uid() = id);
create policy "profiles self update" on profiles for update using (auth.uid() = id);

create policy "topics read all authed" on topics for select using (auth.role() = 'authenticated');
create policy "topics teachers write" on topics for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "questions read all authed" on questions for select using (auth.role() = 'authenticated');
create policy "questions teachers write" on questions for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "attempts students own" on attempts for select using (student_id = auth.uid());
create policy "attempts students insert own" on attempts for insert with check (student_id = auth.uid());
create policy "attempts teachers read all" on attempts for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher'));

create policy "mastery students own" on mastery for select using (student_id = auth.uid());
create policy "mastery students upsert own" on mastery for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "mastery teachers read all" on mastery for select using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher'));

-- Seed sample topics/questions
insert into topics (id, name, description, color)
values
('00000000-0000-0000-0000-000000000001','Linear Equations','Solve and graph linear equations.','#dbeafe'),
('00000000-0000-0000-0000-000000000002','Factoring','Factor quadratics and polynomial expressions.','#ede9fe'),
('00000000-0000-0000-0000-000000000003','Functions','Function notation, domain/range, transformations.','#dcfce7')
on conflict do nothing;

insert into questions (topic_id, question_text, answer_choice_a, answer_choice_b, answer_choice_c, answer_choice_d, correct_answer, explanation, difficulty, misconception_notes)
values
('00000000-0000-0000-0000-000000000001','Solve 3x - 7 = 11','x = 2','x = 6','x = 18','x = -6','B','Add 7 to both sides, then divide by 3.','easy','Students forget to divide entire side.'),
('00000000-0000-0000-0000-000000000002','Factor x^2 + 7x + 12','(x+3)(x+4)','(x+2)(x+6)','(x-3)(x-4)','Prime','A','Find two numbers that multiply to 12 and add to 7.','medium','Sign errors are common.'),
('00000000-0000-0000-0000-000000000003','If f(x)=2x^2-3 and x=4, find f(4)','29','13','5','32','A','Substitute x=4: 2(16)-3=29.','easy','Some students square after multiplying by 2.')
on conflict do nothing;
