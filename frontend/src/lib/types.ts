export interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other";
  medical_info: string;
  parentId: string;
  is_present?: boolean; // Optional depending on if your API merges this field
}

export interface AttendancePayload {
  childId: string;
  body: {
    attendance_date: string;
    check_in_time: number;
    check_out_time: number;
    status: boolean;
    justification: string;
  };
}
