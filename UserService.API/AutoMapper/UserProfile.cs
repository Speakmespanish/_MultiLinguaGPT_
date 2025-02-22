using AutoMapper;
using UserService.API.DTOs;
using UserService.Core.Entities;

namespace UserService.API.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile ()
        {
            //Mapping from User to UserDTO Then from UserDTO to User with ReverseMap
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.LanguagePreference, opt => opt.MapFrom(src => src.LanguagePreference))
                .ForMember(dest => dest.UserType, opt => opt.MapFrom(src => src.UserType))
                .ReverseMap();

            //Mapping from User to UserCreateDTO Then from UserCreateDTO to User with ReverseMap
            CreateMap<User, UserCreateDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))    
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.LanguagePreference, opt => opt.MapFrom(src => src.LanguagePreference))
                .ReverseMap();

            //Mapping from User to UserUpdateDTO Then from UserUpdateDTO to User with ReverseMap
            CreateMap<User, UserUpdateDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.LanguagePreference, opt => opt.MapFrom(src => src.LanguagePreference))
                .ReverseMap();
        }
    }
}
