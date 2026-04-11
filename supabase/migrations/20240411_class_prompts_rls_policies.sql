-- RLS policies for class_prompts table

-- Policy to allow teachers to insert prompts for their classes
CREATE POLICY "Teachers can insert prompts for their classes"
ON class_prompts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = class_prompts.class_id 
    AND classes.teacher_id = auth.uid()
  )
);

-- Policy to allow class members (students and teachers) to view prompts
CREATE POLICY "Class members can view prompts"
ON class_prompts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM class_members
    WHERE class_members.class_id = class_prompts.class_id
    AND class_members.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = class_prompts.class_id
    AND classes.teacher_id = auth.uid()
  )
);

-- Policy to allow teachers to update prompts for their classes
CREATE POLICY "Teachers can update prompts for their classes"
ON class_prompts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = class_prompts.class_id 
    AND classes.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = class_prompts.class_id 
    AND classes.teacher_id = auth.uid()
  )
);

-- Policy to allow teachers to delete prompts for their classes
CREATE POLICY "Teachers can delete prompts for their classes"
ON class_prompts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = class_prompts.class_id 
    AND classes.teacher_id = auth.uid()
  )
);
